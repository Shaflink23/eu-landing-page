# PhoneInput Component

A comprehensive phone number input component with country selection, built with shadcn/ui.

## ✨ Features

- **🔍 Searchable Country Dropdown**: Search by country name, code, or dial code
- **🏳️ Flag Integration**: Visual country flags for easy identification
- **🎨 Form Integration**: Matches your existing form styling
- **✅ Error States**: Visual error feedback
- **🔒 Accessibility**: Full keyboard navigation support
- **📱 Responsive**: Works on all screen sizes
- **🌍 Comprehensive**: 200+ countries supported
- **⚡ Performance**: Optimized filtering and rendering

## 📦 Installation

The component is already installed and ready to use. It requires:
- `shadcn/ui` select component
- `shadcn/ui` input component
- `lucide-react` for icons

## 🚀 Usage

### Basic Usage

```tsx
import { PhoneInput } from "@/components/ui/phone-input";

function MyForm() {
  const [phone, setPhone] = React.useState("");

  return (
    <PhoneInput
      value={phone}
      onChange={setPhone}
      placeholder="Enter phone number"
      label="Phone Number"
      required
    />
  );
}
```

### With Error State

```tsx
<PhoneInput
  value={phone}
  onChange={setPhone}
  error={hasError}
  label="Phone Number"
/>
```

### Disabled State

```tsx
<PhoneInput
  value={phone}
  onChange={setPhone}
  disabled={true}
  label="Phone Number"
/>
```

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | Current phone number value |
| `onChange` | `(value: string) => void` | - | Callback when value changes |
| `onBlur` | `() => void` | - | Callback when input loses focus |
| `placeholder` | `string` | `"Enter phone number"` | Placeholder text |
| `className` | `string` | - | Additional CSS classes |
| `error` | `boolean` | `false` | Whether to show error state |
| `disabled` | `boolean` | `false` | Whether input is disabled |
| `required` | `boolean` | `false` | Whether input is required |
| `label` | `string` | - | Label text |

## 🔍 Search Functionality

The country dropdown supports searching by:
- **Country Name**: "Uganda", "United States", "Kenya"
- **Country Code**: "US", "UG", "KE"
- **Dial Code**: "+256", "+1", "+254"

### Search Examples:
- Type "Uganda" → Shows Uganda 🇺🇬
- Type "UG" → Shows Uganda 🇺🇬
- Type "+256" → Shows Uganda 🇺🇬
- Type "Kenya" → Shows Kenya 🇰🇪
- Type "254" → Shows Kenya 🇰🇪

## 📱 Integration with Forms

### With React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { PhoneInput } from "@/components/ui/phone-input";

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [phone, setPhone] = React.useState("");

  const onSubmit = (data) => {
    console.log({ ...data, phone });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PhoneInput
        value={phone}
        onChange={setPhone}
        label="Phone Number"
        error={!!errors.phone}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With Zod Validation

```tsx
import { z } from "zod";
import { PhoneInput } from "@/components/ui/phone-input";

const phoneSchema = z.object({
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number")
});

function MyForm() {
  const [formData, setFormData] = React.useState({ phone: "" });
  const [errors, setErrors] = React.useState({});

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
    
    // Validate with Zod
    const result = phoneSchema.safeParse({ phone: value });
    if (!result.success) {
      setErrors(prev => ({ ...prev, phone: result.error.errors[0].message }));
    } else {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  return (
    <PhoneInput
      value={formData.phone}
      onChange={handlePhoneChange}
      label="Phone Number"
      error={!!errors.phone}
      required
    />
  );
}
```

## 🎨 Styling

The component uses your existing form styling:
- **Font**: Roboto, sans-serif
- **Height**: 40px (matches your form inputs)
- **Border**: Gray-300 with green focus ring
- **Error State**: Red border with red-50 background
- **Placeholder**: Gray-500 text

## 🌍 Country Data

The component includes comprehensive country data:

### Popular Countries (shown first):
- United States 🇺🇸 (+1)
- United Kingdom 🇬🇧 (+44)
- Uganda 🇺🇬 (+256)
- Kenya 🇰🇪 (+254)
- Canada 🇨🇦 (+1)
- Australia 🇦🇺 (+61)

### African Countries:
Comprehensive coverage of all African nations with proper flags and dial codes.

### Global Coverage:
200+ countries supported with accurate flag emojis and dial codes.

## 🔧 Customization

### Custom Styling

```tsx
<PhoneInput
  value={phone}
  onChange={setPhone}
  className="my-custom-class"
  label="Custom Label"
/>
```

### Custom Placeholder

```tsx
<PhoneInput
  value={phone}
  onChange={setPhone}
  placeholder="Your mobile number"
/>
```

## 📋 Examples

See `src/components/examples/PhoneInputExample.tsx` for a complete interactive example.

## 🚀 Integration Status

✅ **TravellerVibesForm**: Successfully integrated
✅ **TypeScript**: Fully typed
✅ **Build**: Passing
✅ **Form Validation**: Compatible with existing validation
✅ **Error Handling**: Visual error states
✅ **Accessibility**: Keyboard navigation

## 🔍 Troubleshooting

### Search Not Working
- Ensure the dropdown is properly opened
- Try typing country names, codes, or dial codes
- Clear search with the X button

### Styling Issues
- Component uses your existing form styling
- Ensure shadcn/ui theme is properly configured
- Check CSS classes are not being overridden

### TypeScript Errors
- Ensure all required props are provided
- Check that onChange callback has correct signature
- Verify component is imported correctly

## 🎯 Best Practices

1. **Always provide onChange callback** for state management
2. **Use error prop** for form validation feedback
3. **Include required prop** for mandatory fields
4. **Test with different countries** to ensure proper formatting
5. **Handle empty states** in your form logic
6. **Validate phone numbers** server-side as well

## 📞 Phone Number Format

The component outputs phone numbers in E.164 format:
- `+256755123456` (Uganda)
- `+14155552671` (USA)
- `+254722123456` (Kenya)

This format is internationally recognized and works with most SMS and phone services.