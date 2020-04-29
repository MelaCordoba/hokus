import * as React from "react";
import { HoForm, ComponentRegistry } from "./../components/HoForm";
import { MultiFormatDataDisplay } from "./../components/MultiFormatDataDisplay";
import dynamicFormComponents from "./../components/HokusForm/components/all";
import { FormBreadcumb } from "./../components/Breadcumb";
import { HokusForm } from "../components/HokusForm";
import { formConfigurationsIncludes } from "../utils/configurations-includes";
import service from "../services/service";

const componentRegistry = new ComponentRegistry(dynamicFormComponents);

type WorkspaceConfigProps = {
  siteKey: string;
  workspaceKey: string;
};
type WorkspaceConfigState = {
  values: any,
  form: any;
  workspaceFormKey: number;
  formKey: number;
};

export class WorkspaceConfig extends React.Component<WorkspaceConfigProps, WorkspaceConfigState> {
  formRef: any;
  state: WorkspaceConfigState = {
    values: {},
    form: {},
    formKey: 1,
    workspaceFormKey: 1
  };

  constructor(props: WorkspaceConfigProps) {
    super(props);
  }

  async componentDidMount(){
    const values = (await service.api.getWorkspaceConfig(this.props.siteKey, this.props.workspaceKey))||{};
    this.setState({values, workspaceFormKey: this.state.workspaceFormKey+1});
  }

  handleFormRef = (ref: any) => {
    this.formRef = ref;
  };

  handleSave = (arg1: { data: any; accept: any; reject: any }) => {
    this.setState({ form: arg1.data, formKey: ++this.state.formKey });
    arg1.accept();
    service.api.setWorkspaceConfig(this.props.siteKey, this.props.workspaceKey, arg1.data);
  };

  render() {
    // const formState = this.state.form||{} as any;
    // const fields = formState.fields || [];
    // const selector = ["collections", "test"];
    // const forms = [
    //   ...formState.collections?.map((x: any) => ['collections', x.key])||[],
    //   ...formState.singles?.map((x: any) => ['singles', x.key])||[]
    // ];

    return (
      <div style={{ display: "flex" }}>
        <div style={{ flex: "1", position: "relative" }}>
          <HokusForm
          key={this.state.workspaceFormKey}
            onSave={this.handleSave}
            rootName={"Workspace Config"}
            includes={formConfigurationsIncludes}
            ref={this.handleFormRef}
            fields={[
              {
                key: "hugover", title: "Hugo Version", type: "string", required: true, tip: `Sample: 0.69.2 or extended_0.69.2.
                
The value must match the version you want from the Hugo Releases page (in Hugo Git repository).` },
              {
                key: "collections", type: "accordion", title: "Collections", fields: [
                  { key: "key", title: "Key", type: "string", tip: "sample: awesomePosts" },
                  { key: "title", title: "Title", type: "string", required: true, tip: "Sample: Awesome Posts" },
                  { key: "itemtitle", title: "Item Title", type: "string", required: true, tip: "sample: Awesome Post" },
                  { key: "folder", title: "Folder", type: "string", required: true, tip: "Sample: content/posts/" },
                  { key: "extension", title: "File Extension", type: "select", required: true, options: [{ value: "md" }, { value: "html" }, { value: "markdown" }, { value: "json" }, { value: "toml" }, { value: "yaml" }] },
                  { key: "dataformat", title: "Data Format", type: "select", required: true, options: [{ value: "json" }, { value: "toml" }, { value: "yaml" }] },
                  { key: "fieldsAccordionInclude", type: "include", include: "fieldsAccordionInclude", itemTitleKey: "key", }
                ]
              },
              {
                key: "singles", type: "accordion", title: "Singles", fields: [
                  { key: "key", title: "Key", type: "string", tip: "sample: configuration" },
                  { key: "title", title: "Title", type: "string", required: true, tip: "sample: Configuration File" },
                  { key: "file", title: "Item Title", type: "string", required: true, tip: "sample: config.toml" },
                  { key: "fieldsAccordionInclude", type: "include", include: "fieldsAccordionInclude", itemTitleKey: "key", }
                ]
              },
            ]}
            values={this.state.values}
            plugins={{
              openBundleFileDialog: function ({ title, extensions, targetPath }: any, onFilesReady: any) {
                alert("This operation is not supported in the Cookbook. But we'll mock something for you.");
                return Promise.resolve([`${targetPath}/some-file.${extensions[0] || "png"}`]);
              },
              getBundleThumbnailSrc: function (targetPath: string) {
                return Promise.resolve(
                  "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
                );
              }
            }}
          />
        </div>
        {/* <div style={{ padding: "1rem", flex: "1" }}>
          <HoForm
            key={this.state.formKey}
            rootName={"Resulting Form"}
            includes={formConfigurationsIncludes}
            ref={this.handleFormRef}
            breadcumbComponentType={FormBreadcumb}
            fields={
              fields.length === 0
                ? [
                  {
                    key: "emptyInfo",
                    content: "Your form is empty.",
                    type: "info",
                    theme: "gray"
                  }
                ]
                : (fields[selector[0]]?.find(x => x.key === selector[1])?.fields || [])
            }
            debug={true}
            componentRegistry={componentRegistry}
            values={{}}
            plugins={{
              openBundleFileDialog: function ({ title, extensions, targetPath }: any, onFilesReady: any) {
                alert("This operation is not supported in the FormBuilder. But we'll mock something for you.");
                return Promise.resolve([`${targetPath}/some-file.${extensions[0] || "png"}`]);
              },
              getBundleThumbnailSrc: function (targetPath: string) {
                return Promise.resolve(
                  "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
                );
              }
            }}
          />
          <SelectField fullWidth={true}>
            {forms.map((x: string[]) => <MenuItem primaryText={`${x[0]} > ${x[1]}`}></MenuItem>)}
          </SelectField>
          <br />
          <MultiFormatDataDisplay data={{ fields }} />
        </div> */}
      </div>
    );
  }
}
