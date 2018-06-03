
const avtiveViews = {};
const activeViewList = [];
export class ViewAttachQueue {
  constructor() {
    this.queue = [];
  }
  addActiveView(parentView, view, lastTree) {
    const parentKey = parentView.key;
    const currentKey = view.key;
    const resultParent = this.findActivViews(avtiveViews, parentKey);
    if (resultParent && resultParent.primaryView) {
      const currentTree = resultParent[currentKey];
      if (currentTree && currentTree.primaryView) {
        currentTree.primaryView = view;
        currentTree.parent = resultParent;
      } else {
        if (lastTree) {
          lastTree.parent = resultParent;
          resultParent[currentKey] = lastTree;
        } else {
          resultParent[currentKey] = {
            primaryView: view,
            parent: resultParent
          };
        }
      }
    } else {
      avtiveViews[currentKey] = lastTree ? lastTree : {
        primaryView: view,
        parent: avtiveViews
      };
    }
    this.loadAllActiveViews();
  }
  changeActiveView(currentView, nextView, nextViewTree) {
    const currentKey = currentView.key;
    const resultCurrent = this.findActivViews(avtiveViews, currentKey);
    if (!resultCurrent) {
      return;
    }
    const parent = resultCurrent.parent;
    delete parent[currentKey];
    const nextKey = nextView.key;
    if (nextViewTree && nextViewTree.primaryView) {
      parent[nextKey] = nextViewTree;
      nextViewTree.primaryView = nextView;
      nextViewTree.parent = parent;
    } else {
      parent[nextKey] = {
        primaryView: nextView,
        parent: parent
      };
    }
    this.loadAllActiveViews();
    return resultCurrent;
  }
  removeActiveView(view) {
    const currentKey = view.key;
    const resultCurrent = this.findActivViews(avtiveViews, currentKey);
    if (!resultCurrent) {
      return;
    }
    const parent = resultCurrent.parent;
    delete parent[currentKey];

    this.loadAllActiveViews();
    return resultCurrent;
  }

  findActivViews(activeViewsTree, key, callback) {
    let retView = null;
    if (activeViewsTree) {
      for (let viewKey in activeViewsTree) {
        if (viewKey === undefined || viewKey === 'undefined') {
          continue;
        }
        const current = activeViewsTree[viewKey];
        if (!current.primaryView || !current.parent) {
          continue;
        }
        if (callback) {
          callback(current);
        }
        if (viewKey === key) {
          retView = current;
        } else if (current && viewKey !== 'view' && viewKey !== '0') {
          retView = this.findActivViews(current, key, callback);
        }
      }
    }
    return retView;
  }
  loadAllActiveViews() {
    const resultList = [];
    this.findActivViews(avtiveViews, 'all', (current) => {
      resultList.push(current)
    });
    const currentLength = activeViewList.length;
    for (let i = 0; i < currentLength; i++) {
      activeViewList.pop();
    }
    for (let result of resultList) {
      if (!result.primaryView || !result.parent) {
        continue;
      }
      activeViewList.push(i.primaryView);
    }
    return activeViewList;
  }
  getActiveViewList() {
    return activeViewList;
  }
}
