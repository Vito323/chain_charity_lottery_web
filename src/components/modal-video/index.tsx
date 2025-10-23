"use client";
import React from "react";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";

const VideoModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleOpenModal = () => {
    console.log('Opening video modal...'); // 调试日志
    setIsOpen(true);
  };
  
  return (
    <div className="relative">
      {/* 视频播放按钮 */}
      <button 
        onClick={handleOpenModal}
        aria-label="Play video"
        type="button"
        className="group relative w-16 h-16 bg-white/80 hover:bg-white border-2 border-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
      >
        {/* 波纹效果 - 多个同心圆，更慢更自然 */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" style={{animationDuration: '3s'}}></div>
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
        <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" style={{animationDelay: '2s', animationDuration: '3s'}}></div>
        
        {/* 播放图标 */}
        <div className="relative z-10 flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-300 ml-1" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        
        {/* 悬停时的光晕效果 */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-fuchsia-600/20 blur-md"></div>
      </button>
      
      {/* 视频模态框 */}
      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId="iSbzh0r9IV4"
        onClose={() => {
          console.log('Closing video modal...'); // 调试日志
          setIsOpen(false);
        }}
        allowFullScreen={true}
        autoplay={true}
      />
    </div>
  );
};

// class VideoModal extends React.Component {

//   constructor () {
//     super()
//     this.state = {
//       isOpen: false
//     }
//     this.openModal = this.openModal.bind(this)
//   }

//   openModal () {
//     this.setState({isOpen: true})
//   }

//   render () {
//     return (
//       <div>
//         <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId='iSbzh0r9IV4' onClose={() => this.setState({isOpen: false})} />
//           <div className="video-btn">
//               <ul>
//                   <li>
//                     <button className="wrap" onClick={this.openModal}><i className="fi flaticon-play-button-2" aria-hidden="true"></i></button>
//                   </li>
//               </ul>
//           </div>
//       </div>
//     )
//   }
// }

export default VideoModal;
