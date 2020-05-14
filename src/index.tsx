import { MVVM, VNode, React, Fragment, Ref } from "noreact";
import { Tool } from "./tools";
class Home extends MVVM {
    constructor() {
        super();
    }
    protected $Render(): VNode {
        return <Fragment>
            <ToDoList></ToDoList>
        </Fragment>

    }
}

class ToDoList extends MVVM {
    todos: Todo[] = [];
    counter = 0;
    editTarget: Todo = null;
    add: Ref<Add> = new Ref();
    protected $Render(): VNode {
        return <div className="todo-list">
            {this.todos.map(todo => {
                return <TodoItem onDelete={(id) => { this.todos = this.todos.filter(todo => todo.id != id) }} todo={todo} onEdit={(id) => { this.onEdit(id) }}></TodoItem>
            })}
            <Add ref={this.add} onSave={(obj) => this.onAdd(obj)}></Add>
        </div>
    }
    onAdd(obj: Todo) {
        if (this.editTarget) {
            Object.assign(this.editTarget, obj);
        } else {
            obj.id = this.counter++;
            this.todos.push(obj)
        }
    }
    onEdit(id: number) {
        this.editTarget = this.todos.find(item => item.id == id);
        this.add.current.edit(this.editTarget);
    }
}
class Add extends MVVM {
    private obj: Todo = {
        text: null,
        date: null,
        isImportant: null,
        remind: null,
        once: '0'
    };


    constructor(private props: { onSave: ((obj: Todo) => void) }) {
        super(props);
    }
    edit(target: Todo) {
        debugger
        Object.assign(this.obj, target);
    }
    protected $Render(): VNode {
        return <div style={{ border: '1px solid black' }}>
            <div>
                内容:<input value={this.obj.text} onChange={(event) => this.onChange(event, 'text')} />
            </div>
            <div>
                时间:<input type="date" value={this.obj.date} onChange={(event) => this.onChange(event, 'date')} />
            </div>
            <div>
                是否重要<input checked={this.obj.isImportant == '1'} onChange={(event) => this.onChange(event, 'isImportant')} type="radio" value="1" />重要&nbsp;
                <input checked={this.obj.isImportant == '0'} onChange={(event) => this.onChange(event, 'isImportant')} type="radio" value="0" />不重要
            </div>
            <div>
                是否到时提醒<input checked={this.obj.remind == '1'} onChange={(event) => this.onRemindChange(event)} type="checkbox" value="1" />
            </div>
            <div>
                仅此一次<select value={this.obj.once} onChange={(event) => this.onChange(event, 'once')}>
                    <option value="1">是</option>
                    <option value="0">否</option>
                </select>
            </div>

            <button onClick={() => this.onSave()}>save</button>
        </div>
    }
    onChange(event, name) {
        this.obj[name] = event.target.value;
    }
    onRemindChange(event) {
        this.obj.remind = event.target.checked ? '1' : '0';
    }
    onSave() {
        this.props.onSave(Object.assign({}, this.obj));
    }
}
interface Todo {
    id?: number;
    text: string;
    date: string;
    isImportant: string;
    remind: string;
    once: string;
}
class TodoItem extends MVVM {
    constructor(private props: { todo: Todo, onEdit: (id: number) => void, onDelete: (id: number) => void }) {
        super(props);
    }
    protected $Render(): VNode {
        return <div className="todo-item" style={{ border: '1px solid red', marginBottom: '10px' }}>
            id:{this.props.todo.id},<br />text:{this.props.todo.text},<br />是否重要:{this.props.todo.isImportant == '1' ? '重要' : '不重要'}
            <br />是否提醒{this.props.todo.remind == '1' ? '是' : '否'}<br />仅本次{this.props.todo.once == '1' ? '是' : '否'}<br />日期{this.props.todo.date}
            <button onClick={() => { this.props.onEdit(this.props.todo.id) }}>edit</button>
            <button onClick={() => { this.props.onDelete(this.props.todo.id) }}>delete</button>
        </div>
    }

}

let home = new Home();

let tool = new Tool();
home.$AppendTo(document.body);
tool.$AppendTo(document.body);