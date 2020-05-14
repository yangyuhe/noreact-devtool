import { MVVM, VNode, React, Fragment } from "noreact";

import { Topbar } from "./topbar"
import { Component } from "./components";
import "./scss/tools.scss";
import "./font/iconfont.css";

export class Tool extends MVVM {
    tabs = [{ icon: 'icon-component', name: "Components" }, { name: "Setting", icon: 'icon-setting' }];
    curtab = "Components";
    component = null;
    protected $Render(): VNode {
        if (!this.component) {
            this.component = <Component parent={this.$id}></Component>;
        }
        return <Fragment>
            <Topbar curTab={this.curtab} tabs={this.tabs} onchange={(name) => this.onTabChange(name)}></Topbar>
            {this.curtab == 'Components' ? this.component : null}
        </Fragment>
    }
    onTabChange(name: string) {
        let tab = this.tabs.find(tab => tab.name == name);
        if (tab)
            this.curtab = tab.name;
    }
}
