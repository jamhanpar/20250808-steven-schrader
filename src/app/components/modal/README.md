# Modal System Documentation

## Overview

This project includes a flexible and reusable modal system with the following features:

- **Dynamic Content**: Update modal content and title dynamically using hooks
- **Glass Morphism Design**: Modern glass effect styling with backdrop blur
- **Accessibility**: Full keyboard navigation support with escape key and focus management
- **Contact Form**: Glass morphism contact form with floating chat button
- **Animations**: Smooth enter/exit animations using Framer Motion
- **Responsive**: Works seamlessly across desktop and mobile devices

## Components

### 1. `useModal` Hook

Located: `src/app/hooks/useModal.ts`

A custom hook that manages modal state and provides controls for opening, closing, and updating modal content.

```typescript
const [modalState, modalControls] = useModal();

// Open modal with content
modalControls.openModal({
  title: "My Modal",
  content: <div>Hello World!</div>,
  onClose: () => console.log("Modal closed"),
});

// Update content dynamically
modalControls.updateContent(<div>New content!</div>);

// Update title dynamically
modalControls.updateTitle("New Title");

// Close modal
modalControls.closeModal();
```

### 2. `Modal` Component

Located: `src/app/components/modal/Modal.tsx`

The main modal component with customizable properties:

```typescript
<Modal
  isOpen={modalState.isOpen}
  title={modalState.title}
  onClose={modalControls.closeModal}
  size="md" // 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton={true}
  closeOnOverlayClick={true}
  closeOnEscape={true}
>
  {modalState.content}
</Modal>
```

**Props:**

- `isOpen`: Boolean to control modal visibility
- `title`: Optional modal title
- `onClose`: Function called when modal should close
- `size`: Modal size variant
- `showCloseButton`: Whether to show the X button
- `closeOnOverlayClick`: Whether clicking overlay closes modal
- `closeOnEscape`: Whether escape key closes modal

### 3. `ContactForm` Component

Located: `src/app/components/contact-form/ContactForm.tsx`

A glass morphism contact form with validation and submission handling:

```typescript
<ContactForm
  onSubmit={async (data) => {
    // Handle form submission
    console.log("Form data:", data);
  }}
  onClose={() => {
    // Handle form close
  }}
/>
```

**Features:**

- Form validation
- Loading states
- Success/error messaging
- Glass morphism styling
- Responsive design

### 4. `ChatButton` Component

Located: `src/app/components/chat-button/ChatButton.tsx`

A floating action button that triggers the contact modal:

```typescript
<ChatButton onClick={handleClick} />
```

**Features:**

- Floating position (bottom right)
- Pulse animation
- Hover tooltip
- Accessible keyboard navigation

### 5. `ContactModalProvider` Component

Located: `src/app/components/contact-modal-provider/ContactModalProvider.tsx`

A provider component that combines the chat button with the contact form modal. This is already integrated into the main layout.

## Usage Examples

### Basic Modal

```typescript
"use client";

import { useModal } from "../hooks/useModal";
import Modal from "../components/modal/Modal";

export default function MyComponent() {
  const [modalState, modalControls] = useModal();

  const openModal = () => {
    modalControls.openModal({
      title: "My Modal",
      content: <div>Hello from modal!</div>,
    });
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>

      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        onClose={modalControls.closeModal}
      >
        {modalState.content}
      </Modal>
    </div>
  );
}
```

### Dynamic Content Updates

```typescript
const updateContent = () => {
  modalControls.updateContent(
    <div>
      <p>Updated content with new data!</p>
      <button onClick={() => modalControls.updateTitle("New Title")}>
        Update Title
      </button>
    </div>
  );
};
```

### Custom Contact Form Integration

```typescript
import ContactForm from "../components/contact-form/ContactForm";

const openContactForm = () => {
  modalControls.openModal({
    title: "Contact Us",
    content: (
      <ContactForm
        onSubmit={async (data) => {
          // Send to your API
          await fetch("/api/contact", {
            method: "POST",
            body: JSON.stringify(data),
          });
        }}
        onClose={modalControls.closeModal}
      />
    ),
  });
};
```

## Styling

### CSS Custom Properties

The modal system uses CSS custom properties for theming:

```css
:root {
  --jp-color-accent: #e37044;
  --jp-color-primary: #fafbfc;
  --jp-spacing-md: 16px;
  --jp-radius-lg: 16px;
  /* ... other variables */
}
```

### Glass Morphism Effect

Glass morphism is achieved through:

- `backdrop-filter: blur()`
- Semi-transparent backgrounds
- Subtle borders
- Layered shadows

### Dark Mode Support

Automatic dark mode support through CSS media queries:

```css
@media (prefers-color-scheme: dark) {
  .modal-content {
    background: rgba(48, 51, 49, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

## Accessibility Features

- **Keyboard Navigation**: Tab through focusable elements
- **Escape Key**: Close modal with escape key
- **Focus Management**: Focus trapped within modal
- **ARIA Labels**: Proper labeling for screen readers
- **Color Contrast**: High contrast mode support

## Animation Details

Using Framer Motion for smooth animations:

- **Enter**: Fade in with scale and slide up
- **Exit**: Fade out with scale and slide down
- **Duration**: 200ms with custom easing
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Examples

Visit `/modal-examples` to see interactive examples of the modal system in action.

## Integration

The contact form modal is automatically available on all pages through the `ContactModalProvider` in the main layout. The floating chat button will appear in the bottom right corner of every page.
