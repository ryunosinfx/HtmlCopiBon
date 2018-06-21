const avtiveViews = {};
const activeViewList = [];
export class ViewAttachQueue {
  constructor() {
    this.queue = [];
  }
  addActiveView(parentView, view, lastTree) {
    const parentId = parentView.id;
    const currentId = view.id;
    // console.log("addActiveView currentId:" + currentId);
    const resultParent = this.findActivViews(avtiveViews, parentId);

    // console.log("addActiveView resultParent:" + resultParent);
    if (resultParent && resultParent.primaryView) {
      const currentTree = resultParent[currentId];
      if (currentTree && currentTree.primaryView) {
        currentTree.primaryView = view;
        currentTree.parent = resultParent;
      } else {
        if (lastTree) {
          lastTree.parent = resultParent;
          resultParent[currentId] = lastTree;
        } else {
          resultParent[currentId] = {
            primaryView: view,
            parent: resultParent
          };
        }
      }
    } else {
      avtiveViews[currentId] = lastTree
        ? lastTree
        : {
          primaryView: view,
          parent: avtiveViews
        };
    }
    this.loadAllActiveViews();
  }
  changeActiveView(currentView, nextView, nextViewTree) {
    const currentId = currentView.id;
    // console.log("changeActiveView currentId:" + currentId);
    const resultCurrent = this.findActivViews(avtiveViews, currentId);
    if (!resultCurrent) {
      return;
    }
    const parent = resultCurrent.parent;
    delete parent[currentId];
    const nextId = nextView.id;
    if (nextViewTree && nextViewTree.primaryView) {
      parent[nextId] = nextViewTree;
      nextViewTree.primaryView = nextView;
      nextViewTree.parent = parent;
    } else {
      parent[nextId] = {
        primaryView: nextView,
        parent: parent
      };
    }
    this.loadAllActiveViews();
    return resultCurrent;
  }
  removeActiveView(view) {
    const currentId = view.id;
    // console.log("removeActiveView currentId:" + currentId);
    const resultCurrent = this.findActivViews(avtiveViews, currentId);
    if (!resultCurrent) {
      return;
    }
    const parent = resultCurrent.parent;
    delete parent[currentId];

    this.loadAllActiveViews();
    return resultCurrent;
  }

  findActivViews(activeViewsTree, id, callback, count) {
    let retView = null;

    // console.log("findActivViews id:" + id + "/count:" + count + "/activeViewsTree:" + activeViewsTree.primaryView + "/" + activeViewsTree.parent);
    //
    // try {
    //   console.log(activeViewsTree);
    // } catch (e) {
    //   console.log(e);
    // }
    const next = count
      ? count + 1
      : 1;
    if (next > 5) {
      return null;
    }
    if (activeViewsTree) {
      for (let viewId in activeViewsTree) {
        if (viewId === undefined || viewId === 'undefined' || viewId === 'parent' || viewId === 'primaryView') {
          continue;
        }
        const current = activeViewsTree[viewId];
        if (!current.primaryView || !current.parent) {
          continue;
        }
        if (callback) {
          callback(current);
        }
        if (viewId === id) {
          retView = current;
        } else if (current && viewId !== 'view' && viewId !== '0') {
          retView = this.findActivViews(current, id, callback, next);
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
      activeViewList.push(result.primaryView);
    }
    return activeViewList;
  }
  getActiveViewList() {
    return activeViewList;
  }
}
