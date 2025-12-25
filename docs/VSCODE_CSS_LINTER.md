# VS Code CSS Linter Configuration for Tailwind CSS

Jika Anda melihat warning seperti:

- `Unknown at rule @tailwind`
- `Unknown at rule @apply`

Ini adalah **false positive** karena CSS linter VS Code tidak mengenali sintaks Tailwind CSS.

## Cara Memperbaiki

### Opsi 1: Gunakan Tailwind CSS IntelliSense Extension

1. Install extension **Tailwind CSS IntelliSense** dari VS Code marketplace
2. Extension ini akan otomatis mengenali sintaks Tailwind

### Opsi 2: Konfigurasi Manual

Tambahkan ke `.vscode/settings.json` (buat folder dan file jika belum ada):

```json
{
  "css.customData": ["./tailwind-css-custom-data.json"],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

File `tailwind-css-custom-data.json` sudah tersedia di root project.

### Opsi 3: Disable CSS Validation

Jika opsi di atas tidak bekerja, tambahkan ke `.vscode/settings.json`:

```json
{
  "css.validate": false
}
```

## Catatan

Warning ini **tidak mempengaruhi** fungsionalitas aplikasi sama sekali.
CSS Tailwind tetap berjalan dengan normal meskipun ada warning di editor.
