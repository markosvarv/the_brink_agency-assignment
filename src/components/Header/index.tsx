import { getPayload } from 'payload'
import config from '@/payload.config'
import HeaderClient from './HeaderClient'

export default async function Header() {
  let headerData: any = null
  try {
    const payload = await getPayload({ config })
    headerData = await payload.findGlobal({
      slug: 'header',
    })
  } catch (err) {
    console.error('Error fetching header global from Payload CMS:', err)
  }

  const logoText = headerData?.logoText || 'The Brink'

  let logoImageUrl: string | null = null
  if (headerData?.logoImage && typeof headerData.logoImage === 'object' && 'url' in headerData.logoImage) {
    logoImageUrl = (headerData.logoImage as { url: string }).url
  }

  const navItems = headerData?.navItems?.length
    ? headerData.navItems
    : [
        { label: 'Home', url: '/' },
        { label: 'Services', url: '#services' },
        { label: 'Work', url: '#work' },
        { label: 'About Us', url: '#about' },
        { label: 'Blog', url: '#blog' },
      ]

  const ctaButton = headerData?.ctaButton || {
    label: 'Get in Touch',
    url: '#contact',
  }

  return (
    <HeaderClient
      logoText={logoText}
      logoImageUrl={logoImageUrl}
      navItems={navItems}
      ctaButton={ctaButton}
    />
  )
}
