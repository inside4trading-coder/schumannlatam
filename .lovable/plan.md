
# Plan: Reubicar y redimensionar el formulario Newsletter

## Objetivo
Mover el formulario de suscripción al newsletter junto al toggle de idioma en el header, y hacerlo más compacto para mantener simetría visual con el resto de elementos.

## Cambios a realizar

### 1. Crear versión compacta del NewsletterSubscribeForm

Crear un nuevo componente `NewsletterSubscribeCompact.tsx` con diseño minimalista:
- Usar Popover para mostrar el formulario al hacer clic
- Botón pequeño con icono de mail como trigger
- Formulario desplegable con los mismos campos pero más compacto
- Eliminar el CardHeader con título y descripción
- Inputs más pequeños y espaciado reducido

### 2. Actualizar el Header en Index.tsx

Modificar la sección derecha del header:
- Agregar el nuevo componente compacto junto al LanguageToggle
- Mantener el orden: Newsletter → LanguageToggle → ThemeToggle
- Eliminar el bloque del newsletter del final de la página

## Diseño visual propuesto

```text
┌─────────────────────────────────────────────────────────────┐
│  [LOGO]  Resonancia Schumann          [📧] [🌐] [🌙/☀️]     │
│          Lecturas diarias...                                │
└─────────────────────────────────────────────────────────────┘
                                          ↑     ↑     ↑
                                    Newsletter  Lang  Theme
```

El botón de newsletter mostrará un popover con:
- Input de nombre (opcional)
- Input de email
- Botón suscribirse

---

## Detalles técnicos

### Nuevo archivo: `src/components/NewsletterSubscribeCompact.tsx`
- Reutiliza la lógica del formulario original
- Usa `Popover` de shadcn/ui para el desplegable
- Botón trigger con solo icono `Mail`
- Formulario dentro del `PopoverContent`
- Estado de éxito mostrado como tooltip o badge

### Modificaciones en `src/pages/Index.tsx`
- Importar `NewsletterSubscribeCompact`
- Agregarlo en el div de controles del header (línea 37-40)
- Eliminar el div del newsletter al final (líneas 103-106)

