import { uid } from "uid";
import type { IWidget, IWidgetView, WidgetChange } from "@/types/widgets";

export const useWidgetsStore = defineStore("widgets", () => {
  const getView = (isInit?: boolean) => {
    const id = uid();
    return {
      id,
      name: id,
      isInit: !!isInit,
    };
  };

  const getWidget = (isInit?: boolean) => {
    const id = uid();
    return {
      id,
      name: id,
      children: [getView(isInit)],
      changes: [],
      isInit: !!isInit,
    };
  };

  const data = ref<IWidget[]>([getWidget(true)]);
  const widgets = ref<IWidget[]>([]);
  const changes = ref<WidgetChange[]>([]);
  const edit = ref(false);

  const setEdit = (value: boolean) => {
    edit.value = value;
    changes.value = [];
    if (value) return;
    widgets.value = JSON.parse(JSON.stringify(data.value));
  };

  const reset = () => {
    edit.value = false;
    widgets.value = [];
    changes.value = [];
  };

  const addChange = (
    widget: IWidget,
    appliedChange: WidgetChange,
    replace?: boolean
  ) => {
    const { id, name, changes: widgetChanges } = widget;

    const { changes: changeItems } = appliedChange;

    const changeHolder = widgetChanges.find(
      (item) => item.id === appliedChange.id
    );

    changeHolder
      ? changeHolder.changes.push(...changeItems)
      : widget.changes.push(appliedChange);

    const changeItem = changes.value.find((item) => item.id === id);
    if (changeItem) {
      changeItem.changes = [
        ...(replace ? [] : changeItem.changes),
        ...changeItems,
      ];
      return;
    }
    changes.value.push({
      id,
      name,
      changes: [...changeItems],
    });
  };

  const addWidget = () => {
    const widget = getWidget();
    const { id, name } = widget;
    const change = {
      id,
      name,
      changes: [{ icon: "mdi-plus-circle", title: "Added widget" }],
    };
    widgets.value.push(widget);
    addChange(widget, change);
  };

  const deleteWidget = (widget: IWidget) => {
    const { id, name } = widget;
    const index = widgets.value.findIndex((item) => item.id === id);

    if (index === -1) return;
    widgets.value.splice(index, 1);
    if (!widget.isInit) {
      const changeIndex = changes.value.findIndex((item) => item.id === id);
      changeIndex !== -1 && changes.value.splice(changeIndex, 1);
      return;
    }
    addChange(
      widget,
      {
        id,
        name,
        changes: [
          { icon: "mdi-close-circle", title: `Deleted widget ${name}` },
        ],
      },
      true
    );
  };

  const addView = (widget: IWidget) => {
    const view = getView();
    const { id, name } = view;
    widget.children.push(view);
    const change = {
      id,
      name,
      changes: [{ icon: "mdi-plus", title: "Added new view" }],
    };
    addChange(widget, change);
  };

  const deleteView = (widget: IWidget, deleteData: IWidgetView) => {
    const { id, name } = deleteData;
    const index = widget.children.findIndex((item) => item.id === id);
    if (index === -1) return;
    widget.children.splice(index, 1);
    if (!deleteData.isInit) {
      const changeIndex = widget.changes.findIndex((item) => item.id === id);
      changeIndex !== -1 && widget.changes.splice(changeIndex, 1);
      return;
    }
    const change = {
      id,
      name,
      changes: [
        { icon: "mdi-close", title: `Deleted view ${deleteData.name}` },
      ],
    };
    addChange(widget, change, true);
  };

  const updateView = (widget: IWidget, updateData: IWidgetView) => {
    const { id, name } = updateData;
    const view = widget.children.find((item) => item.id === id);
    if (!view) return;
    Object.assign(view, { name });
    const changeItem = {
      icon: "mdi-pencil",
      title: `Edited view ${updateData.name}`,
    };
    const change = {
      id,
      name,
      changes: [changeItem],
    };

    addChange(widget, change);
  };

  const onSave = () => {
    data.value = widgets.value.map((item) => {
      const { children: views, ...rest } = item;
      const children = views.map((view) => ({ ...view, isInit: true }));
      return { ...rest, isInit: true, children, changes: [] };
    });
    reset();
  };

  return {
    data,
    widgets,
    edit,
    changes,
    setEdit,
    reset,
    addWidget,
    deleteWidget,
    addView,
    deleteView,
    updateView,
    onSave,
  };
});
