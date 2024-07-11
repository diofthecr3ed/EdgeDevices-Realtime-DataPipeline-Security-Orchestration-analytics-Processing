import React from 'react';
import './index.css'

const Index = () => {
    return (
        <div className="home">
            <div className="node">
                <div className='top'>
                    <div className="header">Node Data</div>
                    <select>
                        {/* Options */}
                    </select>
                </div>
                <div className='data-container'>
                    <iframe 
                        src="http://localhost:3000/d-solo/ddqj959mhsqv4a/nodes-index?orgId=1&refresh=5s&from=1720682910779&to=1720683210780&panelId=17"  
                        className='ram_gauge'
                    ></iframe>

                    <iframe 
                        src="http://localhost:3000/d-solo/ddqj959mhsqv4a/nodes-index?orgId=1&refresh=5s&from=1720688884710&to=1720689184710&panelId=35"  
                        className='cpu_gauge'
                    ></iframe>

                    <iframe 
                        src="http://localhost:3000/d-solo/ddqj959mhsqv4a/nodes-index?orgId=1&refresh=5s&from=1720688411614&to=1720688711614&panelId=3"
                        className='temp_graph'
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
  