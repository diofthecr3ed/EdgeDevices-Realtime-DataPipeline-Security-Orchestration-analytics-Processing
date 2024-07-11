import React from 'react';
import './index.css'

const Index = () => {
      return (
        <div className="home">
            <div className="node">
                <div className='top'>
                    <div className="header">Node Data</div>
                    <select
                        // className="dropdown"
                        // value={}
                        // onChange={}
                    >
                    </select>
                </div>
                <div className='iframe-container'>
                    <iframe
                        // src={`http://${ip}:5000/video_feed`}
                        // frameBorder="0"
                        title="Live Video Feed"
                        className='video-iframe'
                    ></iframe>
                </div>
            </div>

            <div className='livestream'>
                <div className='top2'>
                    <div className='header'>Live Stream</div>
                    <select></select>
                </div>
                <iframe>

                </iframe>
            </div>

            <div className='traffic'>
                <div className='top2'>
                    <div className='header'>Traffic</div>
                </div>
                <div className='chart'>
                    {/* <LiveChart/> */}
                </div>
            </div>

                    
          </div>
    )
}

export default Index;
