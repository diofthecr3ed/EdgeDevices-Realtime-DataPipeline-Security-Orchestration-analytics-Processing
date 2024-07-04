import React from 'react';
import { useLocation } from 'react-router-dom';
import './Overview_alt.css';

const Dashboard = () => {
    const location = useLocation();
    const { ip } = location.state || { ip: 'default-ip' }; // Fallback IP if none is provided

    return (
        <div className="dashboard">
            <div className="item1">
                <div className='top'>
                    <div className="header">Node LiveStream</div>
                    <select
                        // className="dropdown"
                        // value={}
                        // onChange={}
                    >
                        {/* {streams.map((stream, index) => (
                        <option key={index} value={index}>
                            {stream.label}
                        </option>
                        ))} */}
                    </select>
                </div>
                <div className='iframe-container'>
                    <iframe
                        src={`http://${ip}:5000/video_feed`}
                        // frameBorder="0"
                        title="Live Video Feed"
                        className='video-iframe'
                    ></iframe>
                </div>
            </div>

            <div className='item2'>
                <div className='top2'>
                    <div className='header'>SnapShots</div>
                    <select></select>
                </div>
                <iframe>

                </iframe>
            </div>
            <div className='item2'>
                <div className='top2'>
                    <div className='header'>Number Of Vehicles</div>
                    <select></select>
                </div>

            </div>
        </div>
    )
}

export default Dashboard;
