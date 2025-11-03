declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

declare interface QuickstreamAPIType {
  init: (options: { publishableApiKey: string }) => void;
  creditCards: {
    createTrustedFrame: (
      options: any,
      callback: (errors: any, data: any) => void
    ) => void;
  };
}

declare interface Window {
  QuickstreamAPI?: QuickstreamAPIType;
}
