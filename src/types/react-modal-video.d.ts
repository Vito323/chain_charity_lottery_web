declare module 'react-modal-video' {
  import * as React from 'react';

  interface ModalVideoProps {
    channel: 'youtube' | 'vimeo';
    isOpen: boolean;
    videoId: string;
    onClose: () => void;
    autoplay?: boolean;
    allowFullScreen?: boolean;
    children?: React.ReactNode;
  }

  export default class ModalVideo extends React.Component<ModalVideoProps> {}
}
