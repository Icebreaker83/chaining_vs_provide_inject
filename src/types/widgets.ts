export type WidgetBase = {
  id: string;
  name: string;
};

export type IWidgetView = WidgetBase & {
  name: string;
};

export type WidgetChanges = {
  icon: string;
  title: string;
};

export type IWidget = WidgetBase & {
  children: IWidgetView[];
  changes: WidgetChanges[];
};
