# Mask Input and Eye Icon Features

## Overview
This update adds mask input functionality and eye icons for password fields throughout the authentication system.

## Features Added

### 1. Mask Input Support
The `InputContainer` component now supports text masking for various input types:

- **Date Masks**: `99/99/9999` for birth dates
- **Numeric Masks**: `999.9` for weight, `9.99` for height
- **Email Masks**: No mask needed (handled by keyboard type)
- **Phone Masks**: Available if needed (e.g., `(99) 99999-9999`)

### 2. Eye Icon for Password Fields
All password inputs now include a toggleable eye icon that allows users to show/hide their password.

## Implementation Details

### InputContainer Component Updates
- Added `mask` prop for specifying input masks
- Added automatic password detection based on field name or `secureTextEntry` prop
- Integrated `react-native-mask-text` library
- Added SVG eye icons (open/closed states)

### Authentication Components Updated

#### Login Component (`src/modules/auth/login/Login.tsx`)
- Password field now includes eye icon toggle
- Email field remains unmasked (uses email keyboard)

#### Tenant Registration (`src/modules/auth/registration/tenant/Tenant.tsx`)
- Password and confirm password fields include eye icons
- Email field remains unmasked

#### Patient Registration (`src/modules/auth/registration/patient/Patient.tsx`)
- Birth date field uses mask: `99/99/9999`
- Weight field uses mask: `999.9`
- Height field uses mask: `9.99`
- Email field remains unmasked

## Usage Examples

### Basic Password Input
```tsx
<InputContainer
  label="Senha"
  name="password"
  secureTextEntry={true}
  setValue={setValue}
  errors={errors}
  placeholder="Digite sua senha"
/>
```

### Masked Date Input
```tsx
<InputContainer
  label="Data de nascimento"
  name="birthDate"
  mask="99/99/9999"
  setValue={setValue}
  errors={errors}
  placeholder="DD/MM/AAAA"
/>
```

### Masked Numeric Input
```tsx
<InputContainer
  label="Peso"
  name="weight"
  mask="999.9"
  keyboardType="numeric"
  setValue={setValue}
  errors={errors}
  placeholder="0.0"
/>
```

## Dependencies Added
- `react-native-mask-text`: For input masking functionality
- `react-native-svg`: For eye icon rendering (already installed)

## Mask Patterns
- `9`: Any digit
- `A`: Any letter
- `*`: Any character
- `/`: Literal character (will appear in input)

## Notes
- The eye icon automatically appears for any field with `secureTextEntry={true}` or field names containing "password"
- Masks are optional and only applied when the `mask` prop is provided
- The component maintains backward compatibility with existing implementations 