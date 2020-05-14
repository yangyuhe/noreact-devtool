import { MVVM, VNode, React } from "noreact";
import "./scss/instance-list.scss";
import { Arrow } from "./arrow";

export interface Instance {
    name: string,
    data: { [key: string]: any };
    props: { [key: string]: any };
    children: Instance[];
}
export class InstanceItem extends MVVM {
    open = false;
    constructor(private props: { selected: Instance, data: Instance, onSelected: (instance: Instance) => void }) {
        super(props);
    }
    protected $Render(): VNode {
        let cur = this.props.data;
        let arrow = <Arrow open={this.open} onClick={() => { this.open = !this.open; }}></Arrow>;

        return <div className={"instance-item " + (this.props.selected == this.props.data ? 'active' : '')}>
            <div className='instance-item-name '>
                {cur.children.length > 0 ? arrow : null}
                <div class="name-container" onClick={() => this.props.onSelected(cur)}>
                    {'<'}<span className="name">{cur.name}</span>
                    {cur.data ? <span className="key">id</span> : null}
                    {cur.data ? <span className="id">='{cur.data.$id}'</span> : null}
                    {'>'}
                </div>
            </div>
            <div className="instance-item-children" style={{ display: (this.open ? 'block' : 'none') }}>
                {cur.children.map(child => {
                    return <InstanceItem selected={this.props.selected} data={child} onSelected={this.props.onSelected}></InstanceItem>;
                })}
            </div>
        </div >;
    }
}