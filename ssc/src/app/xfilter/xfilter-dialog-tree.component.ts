import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable, Input} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import { formatDate } from '@angular/common';
import { MatSelectionList, MatCheckbox } from '@angular/material';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  value: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  value: string;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.value = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-xfilter-dialog-tree',
  templateUrl: './xfilter-dialog-tree.component.html',
  styleUrls: ['./xfilter.component.scss'],
  providers: [ChecklistDatabase]
})
export class xFilterDialogTreeComponent {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  database:ChecklistDatabase;

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    this.database = _database;
  }

  @Input() list: MatSelectionList;
  @Input() select_all: MatCheckbox;

  //@Input() selected: any;
  @Input() set select_all_checked(checked:boolean) {
    console.log(this.checklistSelection)
    console.log(this.treeControl);
    if(checked) {
      this.treeControl.dataNodes.filter(n => !this.checklistSelection.isSelected(n)).map(n => this.checklistSelection.toggle(n));
    } else {
      this.treeControl.dataNodes.filter(n => this.checklistSelection.isSelected(n)).map(n => this.checklistSelection.toggle(n));
    }
  }

  @Input() set items(value: any) {
    var tree_items = {};

    for(var i in value) {
      var year = formatDate(value[i], 'y', 'en-US');
      var month = formatDate(value[i], 'MMMM', 'en-US');
      var date = formatDate(value[i], 'dd ', 'en-US');
      if(tree_items[year] == null) {
        tree_items[year] = {};
        for(var m=1; m<=12; m++) {
          tree_items[year][formatDate('2020-'+m+'-1', 'MMMM', 'en-US')] = null;
        }
      }
      if(tree_items[year][month] == null) {
        tree_items[year][month] = {};
        for(var d=1; d<=31; d++) {
          tree_items[year][month][String(d).padStart(2, "0")+" "] = null;
        }
      }
      tree_items[year][month][date] = value[i];
    }

    for (let [y, year] of Object.entries(tree_items)) {
      for (let [m, month] of Object.entries(year)) {
        if(year[m] == null) {
          delete year[m];
        } else {
          for (let [d, date] of Object.entries(month)) {
            if(month[d] == null) {
              delete month[d];
            } 
          }
        }
      }
    }

    this.database.dataChange.next(this.database.buildFileTree(tree_items, 0));
    //this.treeControl.expandAll();
    this.treeControl.dataNodes
      .filter(n => this.list.selectedOptions.selected.map(s => s.value).indexOf(n.value) != -1)
      .map(e => (e.expandable)? this.todoItemSelectionToggle(e) : this.todoLeafItemSelectionToggle(e));
    ;
  }

  updateSelected() {
    this.list.deselectAll();
    this.list.options
      .filter(o => this.checklistSelection.selected.map(s => s.value).indexOf(o.value) != -1)
      .map(i => i.selected = true);
    //console.log(this.list.selectedOptions.selected.length +' '+ this.list.options.length)
    if(this.list.options.length > 0) this.select_all.checked = this.list.selectedOptions.selected.length == this.list.options.length;
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = node.children? !!node.children.length : false;
    flatNode.value = node.value;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.updateSelected();
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.updateSelected();
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }
}
