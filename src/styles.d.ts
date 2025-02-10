declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.scss" {
  const content: { [key: string]: string };
  export default content;
}
declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "*.png" {
  const content: string;
  export default content;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.json" {
  const value: any;
  export default value;
}
