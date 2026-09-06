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

  const topBar = headerData?.topBar || {
    showTopBar: true,
    text: 'Emergency number – available 24/7',
    phone: '0900 – 11 22 333',
  }

  const logoText = headerData?.logoText || 'THE BRINK'

  let logoImageUrl: string | null = null
  if (headerData?.logoImage && typeof headerData.logoImage === 'object' && 'url' in headerData.logoImage) {
    logoImageUrl = (headerData.logoImage as { url: string }).url
  }

  const navItems = headerData?.navItems?.length
    ? headerData.navItems
    : [
        { label: 'Service', url: '#service' },
        { label: 'About us', url: '#about' },
        { label: 'Careers', url: '#careers' },
      ]

  const showSearch = headerData?.showSearch !== false

  const ctaButton = headerData?.ctaButton || {
    label: 'Contact us',
    url: '#contact',
  }

  return (
    <HeaderClient
      topBar={topBar}
      logoText={logoText}
      logoImageUrl={logoImageUrl}
      navItems={navItems}
      showSearch={showSearch}
      ctaButton={ctaButton}
    />
  )
}
