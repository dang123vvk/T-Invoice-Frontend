import React from 'react';

export default class PageTemplate extends React.Component {
    render() {
        return (
            <div style={{ position: "absolute", bottom: "0.5cm",right:'1.2cm', width:'83%' }}>
            <hr style={{ border: '1px solid #2196f3'}}></hr>
            <div style={{ position: "absolute", right: "0cm", top:'0.5cm', width:'7%' , backgroundColor: '#2196f3', color: 'white', textAlign:'center'}}>
             {this.props.pageNum} 
             </div>
            </div>
        )
    }
}