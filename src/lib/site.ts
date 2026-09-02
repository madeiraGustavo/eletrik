/**
 * Configuração central da landing Eletrik.
 * Preencha os campos marcados com "PREENCHER" antes de publicar.
 */

const whatsappNumber = '5500000000000'; // PREENCHER: 55 + DDD + número
const whatsappBaseMessage = 'Olá! Vim pela landing da Eletrik e quero um orçamento.';

export type CtaLocation =
	| 'header'
	| 'hero_primary'
	| 'contact'
	| 'cta_final'
	| 'fab'
	| 'obrigado';

export const site = {
	name: 'Eletrik',
	whatsappNumber,
	/** Texto exibido na UI (ex.: "(43) 99999-9999" ou "WhatsApp"). */
	whatsappLabel: 'WhatsApp',
	email: '', // PREENCHER (opcional)
	/** Access key do Web3Forms. Deixe vazio até configurar — não aparece na copy. */
	web3formsAccessKey: '', // PREENCHER
	whatsappBaseMessage,

	/** PREENCHER: cidade principal (ex.: "Londrina"). */
	city: '',
	/** PREENCHER: bairros/áreas (ex.: ["Centro", "Gleba Palhano"]). */
	areaServed: [] as string[],
	/** PREENCHER: texto de horário (ex.: "Seg–Sex 8h–18h"). */
	openingHours: '',
	/**
	 * PREENCHER: URLs de perfis (Google Perfil da Empresa, Instagram…).
	 * Ex.: ["https://www.instagram.com/...", "https://g.page/..."]
	 */
	sameAs: [] as string[],

	/**
	 * PREENCHER: GTM-XXXXXXX (preferencial). Se vazio, usa ga4Id.
	 * No GA4, marcar como eventos-chave: whatsapp_click e generate_lead.
	 * Eventos no dataLayer: whatsapp_click, form_start, generate_lead,
	 * view_section, scroll, select_content.
	 */
	gtmId: '',
	/** PREENCHER: G-XXXXXXXXXX (alternativa se não houver GTM). */
	ga4Id: '',

	/** Caminho público da OG image (com base path aplicado no Layout). */
	ogImage: 'og.jpg',
	ogImageWidth: 1200,
	ogImageHeight: 630,

	/** Valor opcional de conversão para generate_lead (GA4/Ads). */
	leadValue: 0,
	leadCurrency: 'BRL',

	/** Fallback estático; o script de tracking enriquece com UTM no cliente. */
	whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappBaseMessage)}`,
};

export function buildWhatsAppUrl(options: {
	service?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmContent?: string;
	utmTerm?: string;
	gclid?: string;
} = {}): string {
	const parts = [site.whatsappBaseMessage];
	if (options.service) parts.push(`Serviço: ${options.service}`);
	const originBits = [
		options.utmSource && `origem: ${options.utmSource}`,
		options.utmMedium && `meio: ${options.utmMedium}`,
		options.utmCampaign && `campanha: ${options.utmCampaign}`,
		options.utmContent && `conteúdo: ${options.utmContent}`,
		options.utmTerm && `termo: ${options.utmTerm}`,
		options.gclid && `gclid: ${options.gclid}`,
	].filter(Boolean);
	if (originBits.length) parts.push(`(${originBits.join(' | ')})`);
	return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(parts.join('\n'))}`;
}

export function getSeoTitle(): string {
	if (site.city) {
		return `Eletrik | Eletricista em ${site.city} — orçamento no WhatsApp`;
	}
	return 'Eletrik | Serviços elétricos residenciais e comerciais';
}

export function getSeoDescription(): string {
	if (site.city) {
		return `Instalação, manutenção e reparos elétricos em ${site.city}. Peça orçamento pelo WhatsApp.`;
	}
	return 'Instalação, manutenção e reparos elétricos para casa e empresa. Peça orçamento pelo WhatsApp.';
}

export const servicesCatalog = [
	{
		slug: 'instalacao',
		name: 'Instalação elétrica',
		description: 'Pontos novos, circuitos e adequação da fiação em casas e comércios.',
	},
	{
		slug: 'manutencao',
		name: 'Manutenção e reparos',
		description: 'Curto, disjuntor desarmando, tomada queima e falhas do dia a dia.',
	},
	{
		slug: 'quadro',
		name: 'Quadro e disjuntores',
		description: 'Organização, troca e dimensionamento do quadro de distribuição.',
	},
	{
		slug: 'iluminacao',
		name: 'Iluminação',
		description: 'Troca e adequação de luminárias, internas e de área externa.',
	},
] as const;
