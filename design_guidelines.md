# Infinite Collaborative Canvas - Design Guidelines

## Design Approach: Minimalist Utility System
**Justification**: This is a pure utility-focused application where the user has explicitly requested zero UI elements. The design must be invisible, letting the canvas and user content be the entire experience.

## Core Design Principles
1. **Invisible Interface**: The UI should be completely transparent to the user experience
2. **Infinite Continuity**: No visual boundaries or constraints on the white canvas
3. **Coordinate Precision**: Text positioning must be pixel-perfect and persistent
4. **Collaborative Clarity**: Multiple users' content should be visually distinguishable

## Design Elements

### A. Color Palette
**Background**: Pure white (`0 0% 100%`) - infinite, seamless canvas
**Text Content**: 
- User's own text: Near-black (`0 0% 15%`) for optimal readability
- Other users' text: Subtle gray (`0 0% 45%`) to differentiate ownership
**Interactive Elements**:
- Text input modal background: White with subtle shadow
- Modal border: Light gray (`0 0% 90%`)

### B. Typography
**Primary Font**: System font stack for instant loading and familiarity
**Text Sizes**: Single size (16px/1rem) for consistency across all user content
**Weight**: Regular (400) for readability, medium (500) for user's own text to show ownership

### C. Layout System
**Spacing**: No predefined spacing - users control all positioning
**Canvas**: Infinite scrolling/panning in all directions
**Coordinate System**: Pixel-based positioning starting from center origin (0,0)

### D. Component Library

**Core Components**:
1. **Infinite Canvas**: Pure white background, infinite in all directions
2. **Text Input Modal**: Minimal modal appearing on click
   - No close button (click outside to close)
   - Single text input field
   - Invisible submit (Enter key)
3. **Positioned Text Elements**: Rendered at exact coordinates
4. **Pan Controls**: Mouse drag to move canvas (cursor changes to grab/grabbing)

**Interactive States**:
- **Default**: Clean white canvas with subtle cursor indication
- **Panning**: Grab cursor, smooth movement
- **Text Input**: Modal appears with focus on input field
- **Hover**: No hover states (maintains simplicity)

### E. Visual Feedback
**Minimal Indicators**:
- Cursor changes: Default → grab → grabbing for pan interaction
- Very subtle drop shadow on text input modal
- No loading states, animations, or transitions (instant response)

## Interaction Guidelines
1. **Single Click**: Opens text input modal at click coordinates
2. **Mouse Drag**: Pans the entire canvas
3. **Enter Key**: Submits text and closes modal
4. **ESC/Click Outside**: Cancels text input
5. **No Right-Click Menu**: Clean, distraction-free experience

## Real-time Collaboration
- Text appears instantly at exact coordinates
- No user indicators, avatars, or presence awareness
- Content differentiation through subtle color variation only

This design honors the user's explicit request for zero UI elements while ensuring functionality remains intuitive and collaborative features work seamlessly.