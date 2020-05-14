import { MVVM, VNode, React, Dev } from "noreact";
import { Instance, InstanceItem } from "./instance-list";
import { InstanceDetail } from "./instanceDetail";

export class Component extends MVVM {
    instances: Instance[] = [];
    selectedInstance: Instance = null;
    constructor(private props: { parent: number }) {
        super();
        Dev.Subscribe((type, mvvmjson, extra) => {
            if (type == "new") {
                if (!extra) {
                    mvvmjson = mvvmjson.filter(mvvm => !mvvm.data || mvvm.data.$id != this.props.parent);
                    this.instances = this.instances.concat(mvvmjson);
                } else {
                    if (extra.isparent) {
                        let parent = this.getInstance(this.instances, extra.id);
                        parent && (parent.children = parent.children.concat(mvvmjson));
                    } else {
                        let parent = this.getInstanceParent(this.instances, extra.id);
                        if (parent) {
                            let index = parent.children.findIndex(item => item.data.$id == extra.id);
                            parent.children.splice(index, 0, ...mvvmjson);
                        }
                    }
                }
            }
            if (type == "update") {
                mvvmjson = mvvmjson.filter(mvvm => !mvvm.data || mvvm.data.$id != this.props.parent);
                mvvmjson.forEach(mvvm => {
                    this.updateInstance(mvvm);
                });
            }
            if (type == "delete") {
                let deleteSelected = mvvmjson.find(mvvm => mvvm.data.$id == (this.selectedInstance && this.selectedInstance.data.$id));
                if (deleteSelected)
                    this.selectedInstance = null;
                this.instances = this.instances.filter(item => !mvvmjson.find(mvvm => mvvm.data.$id == item.data.$id));
                this.instances.forEach(item => {
                    this.deleteInstance(item, mvvmjson);
                });
            }
        }, instances => {
            this.instances = instances.filter(item => !item.data || item.data.$id != this.props.parent);
        });
    }
    protected $Render(): VNode {
        return <div className="instances-container">
            <div className="instructure">
                {this.instances.map(item => (
                    <InstanceItem selected={this.selectedInstance} data={item} onSelected={(instance) => { this.onInstanceSelected(instance) }}></InstanceItem>
                ))}
            </div>
            <div className="instance-detail-container">
                <InstanceDetail key={this.selectedInstance && this.selectedInstance.data.$id} instance={this.selectedInstance}></InstanceDetail>
            </div>
        </div>
    }
    updateInstance(instance: Instance) {
        let res = this.getInstance(this.instances, instance.data.$id);
        if (res) {
            res.data = instance.data;
            res.props = instance.props;
        }
    }
    getInstance(instances: Instance[], id: number): Instance {
        for (let i = 0; i < instances.length; i++) {
            if (instances[i].data.$id == id) {
                return instances[i];
            }
            let res = this.getInstance(instances[i].children, id);
            if (res)
                return res;
        }
        return null;
    }
    getInstanceParent(instances: Instance[], id: number): Instance {
        for (let i = 0; i < instances.length; i++) {
            if (instances[i].children.find(item => item.data.$id == id)) {
                return instances[i];
            }
            let res = this.getInstanceParent(instances[i].children, id);
            if (res)
                return res;
        }
        return null;
    }
    onInstanceSelected(instance: Instance) {
        this.selectedInstance = instance;
    }
    deleteInstance(instance: Instance, mvvmjson: Instance[]) {
        instance.children = instance.children.filter(child => !mvvmjson.find(item => item.data.$id == child.data.$id));
        instance.children.forEach(child => {
            this.deleteInstance(child, mvvmjson);
        });
    }

}