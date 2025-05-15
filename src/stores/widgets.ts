import { uid } from "uid";
import type { IWidget, IWidgetView, WidgetChanges } from "@/types/widgets";

export const useWidgetsStore = defineStore("widgets", () => {
  const getView = () => {
    const id = uid();
    return {
      id,
      name: id,
    };
  };

  const getWidget = (isInit?: boolean) => {
    const id = uid();
    return {
      id,
      name: id,
      children: [getView()],
      changes: isInit
        ? []
        : [{ icon: "mdi-plus-circle", title: "Added widget" }],
    };
  };
  // in real project, data would contain some async data
  const data = ref<IWidget[]>([getWidget(true)]);

  const widgets = ref<IWidget[]>([]);

  const edit = ref(false);
  const setEdit = (value: boolean) => {
    edit.value = value;
    deletedWidgets.value = [];
    if (value) return;
    widgets.value = JSON.parse(JSON.stringify(data.value));
  };

  const reset = () => {
    edit.value = false;
    widgets.value = [];
    deletedWidgets.value = [];
  };

  const addWidget = () => {
    widgets.value.push(getWidget());
  };

  const deletedWidgets = ref<WidgetChanges[]>([]);
  const deleteWidget = (widget: IWidget) => {
    const index = widgets.value.findIndex((item) => item.id === widget.id);
    if (index === -1) return;
    widgets.value.splice(index, 1);
    data.value.some((item) => item.id === widget.id) &&
      deletedWidgets.value.push({
        icon: "mdi-close-circle",
        title: `Deleted widget ${widget.name}`,
      });
  };

  const addView = (parent: IWidget) => {
    parent.children.push(getView());
    parent.changes.push({ icon: "mdi-plus", title: "Added new view" });
  };

  const deleteView = (parent: IWidget, deleteData: IWidgetView) => {
    const index = parent.children.findIndex(
      (item) => item.id === deleteData.id
    );
    if (index === -1) return;
    parent.children.splice(index, 1);
    parent.changes.push({
      icon: "mdi-close",
      title: `Deleted view ${deleteData.name}`,
    });
  };

  const updateView = (parent: IWidget, updateData: IWidgetView) => {
    const { id, ...rest } = updateData;
    const view = parent.children.find((item) => item.id === id);
    if (!view) return;
    Object.assign(view, rest);
    parent.changes.push({
      icon: "mdi-pencil",
      title: `Edited view ${updateData.name}`,
    });
  };

  const onSave = () => {
    data.value = widgets.value.map((item) => ({ ...item, changes: [] }));
    reset();
  };

  return {
    data,
    widgets,
    edit,
    setEdit,
    reset,
    addWidget,
    deletedWidgets,
    deleteWidget,
    addView,
    deleteView,
    updateView,
    onSave,
  };
});
