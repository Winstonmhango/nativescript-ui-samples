
import viewModel = require("./swipe-actions-model");
import listViewModule = require("nativescript-telerik-ui-pro/listview");
import viewModule = require('ui/core/view');
import frameModule = require("ui/frame");
import utilsModule = require("utils/utils");

var animationApplied = false;

export function onPageLoaded(args) {
    var page = args.object;

    page.bindingContext = new viewModel.ViewModel();
}

// >> listview-swipe-action-thresholds
export function onCellSwiping(args: listViewModule.ListViewEventData) {
    var swipeLimits = args.data.swipeLimits;
    var swipeView = args['swipeView'];
    var mainView = args['mainView'];
    var leftItem = swipeView.getViewById('mark-view');
    var rightItem = swipeView.getViewById('delete-view');

    if (args.data.x > args.data.swipeLimits.threshold && !animationApplied) {
        console.log("Notify perform left action");
        leftItem.getViewById('mark-text').animate({
            rotate: 360,
            duration: 1000
        });
        animationApplied = true;
    } else if (args.data.x < -args.data.swipeLimits.threshold && !animationApplied) {
        rightItem.getViewById('delete-text').animate({
            rotate: -360,
            duration: 1000
        });
        animationApplied = true;
    }
    if (args.data.x > 0) {
        var leftDimensions = viewModule.View.measureChild(
            leftItem.parent,
            leftItem,
            utilsModule.layout.makeMeasureSpec(Math.abs(args.data.x), utilsModule.layout.EXACTLY),
            utilsModule.layout.makeMeasureSpec(mainView.getMeasuredHeight(), utilsModule.layout.EXACTLY));
        viewModule.View.layoutChild(leftItem.parent, leftItem, 0, 0, leftDimensions.measuredWidth, leftDimensions.measuredHeight);
    } else {
        var rightDimensions = viewModule.View.measureChild(
            rightItem.parent,
            rightItem,
            utilsModule.layout.makeMeasureSpec(Math.abs(args.data.x), utilsModule.layout.EXACTLY),
            utilsModule.layout.makeMeasureSpec(mainView.getMeasuredHeight(), utilsModule.layout.EXACTLY));
            
        viewModule.View.layoutChild(rightItem.parent, rightItem, mainView.getMeasuredWidth() - rightDimensions.measuredWidth, 0, mainView.getMeasuredWidth(), rightDimensions.measuredHeight);
    }
}
// << listview-swipe-action-thresholds-notify

// >> listview-swipe-action-thresholds-limits
export function onSwipeCellStarted(args: listViewModule.ListViewEventData) {
    var swipeLimits = args.data.swipeLimits;
    var swipeView = args['object'];
    var leftItem = swipeView.getViewById('mark-view');
    var rightItem = swipeView.getViewById('delete-view');
    swipeLimits.left = swipeLimits.right = args.data.x > 0 ? leftItem.getMeasuredWidth() * 2 : rightItem.getMeasuredWidth() * 2;
}
// << listview-swipe-action-release-limits

export function onSwipeCellFinished(args: listViewModule.ListViewEventData) {
    if (args.data.x > 200) {
        console.log("Perform left action");
    } else if (args.data.x < -200) {
        console.log("Perform right action");
    }
    animationApplied = false;
}

export function onLeftSwipeClick(args: listViewModule.ListViewEventData) {
    var listView = <listViewModule.RadListView>frameModule.topmost().currentPage.getViewById("listView");
    console.log("Left swipe click");
    listView.notifySwipeToExecuteFinished();
}

export function onRightSwipeClick(args) {
    var listView = <listViewModule.RadListView>frameModule.topmost().currentPage.getViewById("listView");
    console.log("Right swipe click");
    var viewModel: viewModel.ViewModel = <viewModel.ViewModel>listView.bindingContext;
    viewModel.dataItems.splice(viewModel.dataItems.indexOf(args.object.bindingContext), 1);
}