import React from 'react';
import PluginItem from "./PluginItem"
import Pokedex from "./Pokedex"
export default function PluginContent(props){
    if(props.viewInfo.type==="listItem"){
        return (
            <div className={'plugincontent plugin-'+props.pluginName}>
				{ props.viewInfo.items.map((item, index) => (
                    <PluginItem key={index} itemType={props.viewInfo.itemType} pluginName={props.pluginName} name={item.name} icon={item.icon} action={item.action} data={item.data} device={item.device} />
                ))}  
            </div>
        );
    }
    if(props.viewInfo.type==="pokedexView"){
        return (
            <div className={'plugincontent plugin-'+props.pluginName}>
				<Pokedex />
            </div>
	);}else{
        return <div></div>;
    }
}

