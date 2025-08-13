# Web Developer Landing Page

A modern, interactive landing page for web and app developers with 3D elements, dark theme, and engaging visuals designed to attract potential clients.

## Features

- Modern dark theme with purple/teal color scheme
- Interactive 3D "Creation Core" built with Three.js
- Dynamic typing effect for hero section text
- Responsive design that works on all devices
- Smooth animations and scrolling effects
- Comprehensive sections including services, process, portfolio, testimonials, and contact
- Clearly organized tech stack display
- Contact form with project type selection

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript for customization

### Installation

1. Clone or download this repository
2. Open `developer.html` in your browser to view the landing page
3. Customize the content and styling as needed

## Customization

### Content

Edit the `developer.html` file to change:
- Logo and navigation links
- Hero section title, subtitle, and call-to-action buttons
- Services offered and their descriptions
- Process steps
- Portfolio items and project details
- Tech stack icons and categories
- Testimonials
- Contact form fields
- Footer information and social links

### Styling

The main styles are in `css/developer.css`. You can modify:
- Color scheme by changing the CSS variables at the top of the file
- Fonts by changing the Google Fonts import statement
- Spacing, sizing, and layout by adjusting the CSS properties
- Animations and transitions

### 3D Model

To change the 3D model:
1. Place your own GLB/GLTF models in the `assets/models/` directory
2. Update the model paths in the `js/developer.js` file:
   ```javascript
   const primaryModelPath = 'path/to/your/model.glb';
   const fallbackModelPaths = [
       'path/to/fallback1.glb',
       'path/to/fallback2.glb'
   ];
   ```

## Technologies Used

- HTML5 and CSS3
- JavaScript (ES6+)
- [Three.js](https://threejs.org/) for 3D graphics
- [GSAP](https://greensock.com/gsap/) for animations
- [Typed.js](https://github.com/mattboldt/typed.js/) for typing effects
- [Font Awesome](https://fontawesome.com/) for icons

## Browser Compatibility

This landing page works in all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- The 3D model may be resource-intensive on older devices
- If performance is an issue, you can simplify the 3D element by:
  1. Using a simpler model
  2. Reducing the number of lights
  3. Disabling some animations
  4. Setting a lower polygon fallback model

## License

This project is available for your use. Feel free to customize it for your needs.

## Acknowledgments

- Three.js community for 3D rendering capabilities
- Font Awesome for the icon library
- Google Fonts for typography options 