type Attribution = {
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_content?: string;
	utm_term?: string;
	gclid?: string;
	fbclid?: string;
};

type TrackingConfig = {
	whatsappNumber: string;
	whatsappBaseMessage: string;
	leadValue: number;
	leadCurrency: string;
	isObrigado: boolean;
};

declare global {
	interface Window {
		dataLayer: Record<string, unknown>[];
		__eletrikTracking?: TrackingConfig;
	}
}

const ATTR_KEY = 'eletrik_attr';
const GCLID_COOKIE = 'eletrik_gclid';
const GCLID_DAYS = 90;

function push(event: Record<string, unknown>) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push(event);
}

function readQuery(): Attribution {
	const params = new URLSearchParams(window.location.search);
	const keys = [
		'utm_source',
		'utm_medium',
		'utm_campaign',
		'utm_content',
		'utm_term',
		'gclid',
		'fbclid',
	] as const;
	const out: Attribution = {};
	for (const key of keys) {
		const value = params.get(key);
		if (value) out[key] = value;
	}
	return out;
}

function setCookie(name: string, value: string, days: number) {
	const maxAge = days * 24 * 60 * 60;
	document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function getCookie(name: string): string | undefined {
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : undefined;
}

function saveAttribution(attr: Attribution) {
	const current = getAttribution();
	const merged = { ...current, ...attr };
	sessionStorage.setItem(ATTR_KEY, JSON.stringify(merged));
	if (merged.gclid) setCookie(GCLID_COOKIE, merged.gclid, GCLID_DAYS);
}

function getAttribution(): Attribution {
	let stored: Attribution = {};
	try {
		stored = JSON.parse(sessionStorage.getItem(ATTR_KEY) || '{}') as Attribution;
	} catch {
		stored = {};
	}
	const gclid = stored.gclid || getCookie(GCLID_COOKIE);
	return gclid ? { ...stored, gclid } : stored;
}

const SERVICE_LABELS: Record<string, string> = {
	instalacao: 'Instalação elétrica',
	manutencao: 'Manutenção e reparos',
	quadro: 'Quadro e disjuntores',
	iluminacao: 'Iluminação',
};

function serviceLabel(service?: string): string | undefined {
	if (!service) return undefined;
	return SERVICE_LABELS[service] || service;
}

function buildWhatsAppUrl(service?: string): string {
	const cfg = window.__eletrikTracking!;
	const attr = getAttribution();
	const parts = [cfg.whatsappBaseMessage];
	const label = serviceLabel(service);
	if (label) parts.push(`Serviço: ${label}`);
	const originBits = [
		attr.utm_source && `origem: ${attr.utm_source}`,
		attr.utm_medium && `meio: ${attr.utm_medium}`,
		attr.utm_campaign && `campanha: ${attr.utm_campaign}`,
		attr.utm_content && `conteúdo: ${attr.utm_content}`,
		attr.utm_term && `termo: ${attr.utm_term}`,
		attr.gclid && `gclid: ${attr.gclid}`,
	].filter(Boolean);
	if (originBits.length) parts.push(`(${originBits.join(' | ')})`);
	return `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(parts.join('\n'))}`;
}

function fillHiddenAttributionFields() {
	const attr = getAttribution();
	const map: Record<string, string | undefined> = {
		utm_source: attr.utm_source,
		utm_medium: attr.utm_medium,
		utm_campaign: attr.utm_campaign,
		utm_content: attr.utm_content,
		utm_term: attr.utm_term,
		gclid: attr.gclid,
		fbclid: attr.fbclid,
	};
	for (const [name, value] of Object.entries(map)) {
		document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`).forEach((input) => {
			if (value) input.value = value;
		});
	}
}

function refreshWhatsAppLinks() {
	document.querySelectorAll<HTMLAnchorElement>('a[data-cta]').forEach((link) => {
		const service = link.dataset.service;
		link.href = buildWhatsAppUrl(service);
	});
}

function bindWhatsAppClicks() {
	document.addEventListener('click', (event) => {
		const target = (event.target as Element | null)?.closest?.('a[data-cta]') as
			| HTMLAnchorElement
			| null;
		if (!target) return;
		const service = target.dataset.service;
		target.href = buildWhatsAppUrl(service);
		push({
			event: 'whatsapp_click',
			cta_location: target.dataset.cta,
			link_text: (target.textContent || '').trim(),
			page_path: window.location.pathname,
			service: service || undefined,
		});
	});
}

function bindFormStart() {
	const form = document.querySelector<HTMLFormElement>('form[data-track-form]');
	if (!form) return;
	let started = false;
	const onFocus = () => {
		if (started) return;
		started = true;
		push({ event: 'form_start', form_id: 'contact', page_path: window.location.pathname });
	};
	form.querySelectorAll('input, textarea').forEach((el) => {
		el.addEventListener('focus', onFocus, { once: true });
	});
}

function bindFaqEvents() {
	document.querySelectorAll<HTMLDetailsElement>('details[data-faq-id]').forEach((details) => {
		details.addEventListener('toggle', () => {
			if (!details.open) return;
			push({
				event: 'select_content',
				content_type: 'faq',
				item_id: details.dataset.faqId,
				page_path: window.location.pathname,
			});
		});
	});
}

function bindVerServicos() {
	document.querySelectorAll<HTMLAnchorElement>('[data-track="ver_servicos"]').forEach((link) => {
		link.addEventListener('click', () => {
			push({
				event: 'select_content',
				content_type: 'nav',
				item_id: 'ver_servicos',
				page_path: window.location.pathname,
			});
		});
	});
}

function bindScrollDepth() {
	const marks = [25, 50, 75, 90];
	const fired = new Set<number>();
	const onScroll = () => {
		const doc = document.documentElement;
		const max = doc.scrollHeight - window.innerHeight;
		if (max <= 0) return;
		const pct = Math.round((window.scrollY / max) * 100);
		for (const mark of marks) {
			if (pct >= mark && !fired.has(mark)) {
				fired.add(mark);
				push({ event: 'scroll', percent_scrolled: mark, page_path: window.location.pathname });
			}
		}
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
}

function bindSectionViews() {
	const sections = document.querySelectorAll<HTMLElement>('[data-section]');
	if (!sections.length || !('IntersectionObserver' in window)) return;
	const timers = new WeakMap<Element, number>();
	const seen = new Set<string>();
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				const id = (entry.target as HTMLElement).dataset.section;
				if (!id || seen.has(id)) continue;
				if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
					const timer = window.setTimeout(() => {
						if (seen.has(id)) return;
						seen.add(id);
						push({
							event: 'view_section',
							section_id: id,
							page_path: window.location.pathname,
						});
						observer.unobserve(entry.target);
					}, 1000);
					timers.set(entry.target, timer);
				} else {
					const existing = timers.get(entry.target);
					if (existing) window.clearTimeout(existing);
				}
			}
		},
		{ threshold: [0.5] },
	);
	sections.forEach((section) => observer.observe(section));
}

function bindFab() {
	const fab = document.querySelector<HTMLElement>('[data-fab]');
	if (!fab) return;
	const onScroll = () => {
		const doc = document.documentElement;
		const max = doc.scrollHeight - window.innerHeight;
		const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
		fab.classList.toggle('is-visible', pct >= 25);
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
}

function fireGenerateLead() {
	const key = 'eletrik_lead_fired';
	if (sessionStorage.getItem(key)) return;
	sessionStorage.setItem(key, '1');
	const cfg = window.__eletrikTracking!;
	push({
		event: 'generate_lead',
		method: 'form',
		value: cfg.leadValue,
		currency: cfg.leadCurrency,
		page_path: window.location.pathname,
	});
}

export function initTracking(config: TrackingConfig) {
	window.__eletrikTracking = config;
	window.dataLayer = window.dataLayer || [];

	const fromQuery = readQuery();
	if (Object.keys(fromQuery).length) saveAttribution(fromQuery);

	fillHiddenAttributionFields();
	refreshWhatsAppLinks();
	bindWhatsAppClicks();
	bindFormStart();
	bindFaqEvents();
	bindVerServicos();
	bindScrollDepth();
	bindSectionViews();
	bindFab();

	if (config.isObrigado) fireGenerateLead();
}
