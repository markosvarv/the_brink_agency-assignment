import { getPayload } from 'payload'
import config from '@/payload.config'
import FooterComponent from './Component'

export default async function Footer() {
  let footerData: any = null
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    footerData = await payload.findGlobal({
      slug: 'footer',
    })
  } catch (err: any) {
    // Graceful fallback if database schema is initializing
  }

  return (
    <FooterComponent
      headline={footerData?.headline}
      newsletterPrompt={footerData?.newsletterPrompt}
      newsletterPlaceholder={footerData?.newsletterPlaceholder}
      newsletterButtonLabel={footerData?.newsletterButtonLabel}
      copyrightText={footerData?.copyrightText}
      privacyLabel={footerData?.privacyLabel}
      privacyUrl={footerData?.privacyUrl}
      instagramUrl={footerData?.instagramUrl}
      linkedinUrl={footerData?.linkedinUrl}
    />
  )
}
