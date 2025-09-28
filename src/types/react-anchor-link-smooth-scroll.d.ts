declare module 'react-anchor-link-smooth-scroll' {
  import * as React from 'react';

  interface AnchorLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    offset?: string | number | (() => number);
  }

  export default class AnchorLink extends React.Component<AnchorLinkProps> {}
}
