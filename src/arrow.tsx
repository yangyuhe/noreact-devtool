import { MVVM, React, VNode } from "noreact";
import "./scss/arrow.scss";

export class Arrow extends MVVM {
    constructor(private props: { open: boolean, onClick: () => void }) {
        super(props);
    }
    protected $Render(): VNode {
        return <div class={"arrow-container " + (this.props.open ? 'open' : '')} onClick={() => { this.props.onClick() }}>
            <span className="arrow " ></span>
        </div>
    }
}