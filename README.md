# PeachFit — Icons

## Files

|File                  |Size     |Use                              |
|----------------------|---------|---------------------------------|
|`apple-touch-icon.png`|180×180  |iOS homescreen (PWA add to home) |
|`icon-192.png`        |192×192  |PWA manifest — Android homescreen|
|`icon-512.png`        |512×512  |PWA manifest — splash screen     |
|`favicon.ico`         |16+32px  |Browser tab (all browsers)       |
|`favicon-32.png`      |32×32    |Browser tab PNG fallback         |
|`favicon-16.png`      |16×16    |Browser tab PNG small            |
|`og-image-icon.png`   |1024×1024|App Store / high-res use         |
|`manifest.json`       |—        |PWA web app manifest             |

## Usage in your HTML `<head>`

```html
<!-- Browser tab -->
<link rel="icon" href="/favicon.ico" sizes="any"/>
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32"/>

<!-- iOS homescreen -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>

<!-- PWA -->
<link rel="manifest" href="/manifest.json"/>
<meta name="theme-color" content="#f2a0b0"/>
```