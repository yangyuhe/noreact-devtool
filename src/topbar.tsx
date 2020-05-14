import { MVVM, VNode, React } from "noreact";
import "./scss/topbar.scss"
export class Topbar extends MVVM {
    constructor(private props: { tabs: { name: string, icon: string }[], curTab: string, onchange: (tab: string) => void }) {
        super(props);
    }
    protected $Render(): VNode {
        let tab = this.props.tabs.map(tab => {
            return <span onClick={() => { this.props.onchange(tab.name) }} className={"tab-item " + (this.props.curTab == tab.name ? 'active' : '')}>
                <span className={"iconfont " + tab.icon}></span>
                <span className="name">{tab.name}</span>
            </span>
        })
        return <div className="topbar">
            <span className="logo"></span>
            <span className="version">Ready Dectected</span>
            {tab}
        </div>
    }

}