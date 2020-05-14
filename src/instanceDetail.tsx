import { MVVM, VNode, React } from "noreact";
import { Instance } from "./instance-list";
import "./scss/instance-detail.scss";
import { Arrow } from "./arrow";
export class InstanceDetail extends MVVM {
    constructor(private props: { instance: Instance }) {
        super(props);
    }
    protected $Render(): VNode {
        if (this.props.instance) {
            let datas = [];
            let instance = this.props.instance;
            for (let key in instance.data) {
                if (key.indexOf("$") != 0)
                    datas.push(
                        <div className="item-container">
                            <Data name={key} value={instance.data[key]}></Data>
                        </div>);
            }
            let props = [];
            for (let key in instance.props) {
                props.push(
                    <div className="item-container">
                        <Data name={key} value={instance.props[key]}></Data>
                    </div>
                );
            }
            return <div className="instance-detail">
                <div className="instance-detail-item">
                    <span className="name">data</span>
                    {datas.length > 0 ? datas : <span class="nodata">no data</span>}
                </div>
                <div className="instance-detail-item">
                    <span className="name">props</span>
                    {props.length > 0 ? props : <span class="nodata">no props</span>}
                </div>
            </div>;
        } else {
            return <span className="nodata">no selected</span>
        }

    }

}
class Data extends MVVM {
    open = false;
    children: VNode;
    constructor(private props: { name: string, value: any }) {
        super(props);
    }
    protected $Render(): VNode {
        if (this.open) {
            this.children = this.getChildren(this.props.value)
        }
        let hasFields = this.hasFields(this.props.value);
        return <div className="data-container">
            {hasFields ? <Arrow open={this.open} onClick={() => { this.open = !this.open; }}></Arrow> : null}
            <span className="data-name">{this.props.name}:</span>
            <span className="data-value">{this.typeOrValue(this.props.value)}</span>
            {this.open ? this.children : null}
        </div>
    }
    typeOrValue(value): string {
        let type = Object.prototype.toString.call(value);
        switch (type) {
            case "[object Object]":
                return value.constructor.name;
            case "[object Array]":
                return 'Array[' + value.length + "]";
            case "[object Function]":
                return "Function";
            case "[object String]":
                return "\"" + value + "\"";
            case "[object Boolean]":
                return value;
            case "[object Number]":
                return value;
            case "[object Null]":
                return "null";
            case "[object Undefined]":
                return "Undefined";
            case "[object Symbol]":
                return value.toString();
            case "[object RegExp]":
                return value;
            default:
                return value;
        }
    }
    getChildren(value: any): VNode {
        let hasFields = this.hasFields(value);
        if (hasFields) {
            let children = [];
            Object.keys(value).forEach(key => {
                children.push(<Data name={key} value={value[key]}></Data>);
            });
            return <div className="children-container">
                {children}
            </div>;
        }
        return null;
    }
    hasFields(value) {
        let type = Object.prototype.toString.call(value);
        if (type == "[object Object]" || type == "[object Array]") {
            if (Object.keys(value).length > 0)
                return true;
        }
        return false;
    }

}