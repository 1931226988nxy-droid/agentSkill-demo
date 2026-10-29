import { createApp } from 'vue';
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Tooltip,
} from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import '@jcc/shared/style.css';
import App from './App.vue';
const app = createApp(App);
[
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Tooltip,
].forEach((component) => app.use(component));
app.mount('#app');
