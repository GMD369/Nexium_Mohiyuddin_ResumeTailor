# Resume Tailor – Test Cases

## Example Input
```json
{
  "name": "Ghulam",
  "email": "ghulam@example.com",
  "jobTitle": "Frontend Developer",
  "resume": "Developed and maintained over 10 key features for a high-traffic e-commerce platform using React, Node.js, and Tailwind CSS, resulting in a 15% increase in user engagement within the first quarter. Implemented responsive design principles ensuring optimal user experience across various devices. Collaborated effectively with backend developers to integrate frontend components seamlessly with existing APIs, consistently meeting project deadlines.",
  "jobDesc": "Looking for a frontend developer with strong React and Tailwind CSS skills, experience in e-commerce, and a passion for performance optimization."
}
```

## Expected Output Format
```json
{
  "tailored_resume": "Ghulam\nghulam@example.com\n\nA highly motivated and results-oriented Frontend Developer with two years of experience building and maintaining responsive, user-friendly web applications. Proven ability to leverage JavaScript, React, and Tailwind CSS to deliver high-quality, performant solutions. Eager to contribute expertise to a dynamic team and continue developing cutting-edge frontend technologies.\n\nDeveloped and maintained over 10 key features for a high-traffic e-commerce platform using React, Node.js, and Tailwind CSS, resulting in a 15% increase in user engagement within the first quarter. Implemented responsive design principles ensuring optimal user experience across various devices. Collaborated effectively with backend developers to integrate frontend components seamlessly with existing APIs, consistently meeting project deadlines.\n\nProficient in JavaScript (ES6+), React, Redux, Tailwind CSS, HTML5, CSS3, Git, Node.js, Jest. Experienced with Agile methodologies and collaborative development environments. Excellent problem-solving and communication skills with a strong work ethic and commitment to continuous learning."
}
``` 