export type WidgetBase = {
  id: string;
  name: string;
  isInit: boolean;
};

export type IChange = {
  icon: string;
  title: string;
};

export type WidgetChange = Pick<WidgetBase, "id" | "name"> & {
  changes: IChange[];
};

export type IWidgetView = WidgetBase & {
  someOtherViewSpecificProps?: unknown;
};

export type IWidget = WidgetBase & {
  children: IWidgetView[];
  changes: WidgetChange[];
};
