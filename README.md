# ReactableTable

A customizable, resizable, and movable table component for React.

## 📌 Props

### `ReactableTableProps`

```typescript
interface ReactableTableProps {
    data: {
        header: HeaderData[];
        content: ContentData[];
    };
    customStyle?: {
        headerStyle?: React.CSSProperties;
        contentStyle?: React.CSSProperties;
    };
    resizable?: boolean;
    movable?: boolean;
}
```

| Prop           | Type                                         | Required | Description |
|---------------|--------------------------------------------|----------|-------------|
| `data`        | `{ header: HeaderData[]; content: ContentData[]; }` | ✅ | Table data containing headers and content. |
| `customStyle` | `{ headerStyle?: React.CSSProperties; contentStyle?: React.CSSProperties; }` | ❌ | Custom styles for header and content. |
| `resizable`   | `boolean`                                   | ❌ | Enables column resizing. Default: `false`. |
| `movable`     | `boolean`                                   | ❌ | Enables column dragging and reordering. Default: `false`. |

---

## 🏷️ Data Structure

### `HeaderData`

```typescript
interface HeaderData {
    id: string;
    title: string;
    renderEditCell?: FC<{
        value: string;
        onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    }>;
}
```

| Property        | Type    | Required | Description |
|---------------|--------|----------|-------------|
| `id`         | `string` | ✅ | Unique identifier for the column. |
| `title`      | `string` | ✅ | Column title displayed in the table header. |
| `renderEditCell` | `FC<{ value: string; onChange: (event: ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => void; rowIndex: number; columnIndex: number; }>` | ❌ | Custom component to render an editable cell. |

#### 🔹 Example usage of `renderEditCell`

```tsx
const MyEditCell: FC<{ 
  value: string; 
  onChange: (event: ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => void;
}> = ({ value, onChange}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e)}
  />
);
```

---

### `ContentData`

```typescript
interface ContentData {
    [key: string]: string;
}
```

Each row in the table is represented as an object where keys correspond to `HeaderData.id`.

#### 🔹 Example content data:

```json
[
  { "name": "Alice", "age": "25" },
  { "name": "Bob", "age": "30" }
]
```

---

## 🛠️ Example Usage

```tsx
const tableData = {
  header: [
    { id: "name", title: "Name" },
    { id: "age", title: "Age" }
  ],
  content: [
    { name: "Alice", age: "25" },
    { name: "Bob", age: "30" }
  ]
};

<ReactableTable data={tableData} resizable={true} movable={true} />;
```
