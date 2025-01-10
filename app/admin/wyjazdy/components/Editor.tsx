import { useEffect, useState } from "react";

import { EditorContent, Editor as TEditor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  UndoRounded,
  RedoRounded,
  FormatListBulletedRounded,
  FormatListNumberedRounded,
  FormatIndentDecreaseRounded,
  FormatIndentIncreaseRounded,
} from "@mui/icons-material";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CaretRightIcon,
  CaretLeftIcon,
} from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-separator";

export default function Editor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose p-4 h-full max-h-[48vh] rounded-lg overflow-y-scroll bg-neutral-100 border-neutral-200 border focus:outline-none max-w-none",
      },
    },
  });

  return (
    <EditorContent
      editor={editor}
      className={`relative ${
        (editor?.isFocused || focused) && "pt-16"
      } transition-all`}
      id="editor"
    >
      {editor && (editor.isFocused || focused) && (
        <EditorSidebar editor={editor} setFocused={setFocused} />
      )}
    </EditorContent>
  );
}

const EditorSidebar = ({
  editor,
  setFocused,
}: {
  editor: TEditor;
  setFocused: (focused: boolean) => void;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [step, setStep] = useState(0);
  const [focusTimeout, setFocusTimeout] = useState<Timer | null>(null);

  const [cardFocused, setCardFocused] = useState(false);
  const [selectFocused, setSelectFocused] = useState(false);

  useEffect(() => {
    if (cardFocused || selectFocused) {
      setFocused(true);
    } else {
      setFocused(false);
    }
  }, [cardFocused, selectFocused]);

  if (isDesktop) {
    return (
      <Card
        className="absolute h-12 z-50 left-1/2 -translate-x-1/2 flex items-center px-2 top-2 gap-2 justify-between"
        onTouchStart={() => {
          setCardFocused(true);

          if (focusTimeout) {
            clearTimeout(focusTimeout);
          }

          setFocusTimeout(
            setTimeout(() => {
              setCardFocused(false);
              setFocusTimeout(null);
            }, 500)
          );
        }}
        onMouseDown={(e) => {
          setCardFocused(true);

          if (focusTimeout) {
            clearTimeout(focusTimeout);
          }

          setFocusTimeout(
            setTimeout(() => {
              setCardFocused(false);
              setFocusTimeout(null);
            }, 500)
          );
        }}
      >
        <div className="border rounded-lg flex">
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().undo().run();
            }}
            variant="ghost"
            className={`hover:bg-transparent hover:text-primary`}
          >
            <UndoRounded />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().redo().run();
            }}
            variant="ghost"
            className={`hover:bg-transparent hover:text-primary`}
          >
            <RedoRounded />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="border rounded-lg flex">
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleBold().run();
            }}
            variant="ghost"
            className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("bold")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("italic") && "rounded-r-none"}`}
          >
            <FontBoldIcon />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleItalic().run();
            }}
            variant="ghost"
            className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("italic")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("bold") && "rounded-l-none"}
                ${editor?.isActive("underline") && "rounded-r-none"}
                `}
          >
            <FontItalicIcon />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleUnderline().run();
            }}
            variant="ghost"
            className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("underline")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("italic") && "rounded-l-none"}
                ${editor?.isActive("strike") && "rounded-r-none"}
                `}
          >
            <UnderlineIcon />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleStrike().run();
            }}
            variant="ghost"
            className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("strike")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("underline") && "rounded-l-none"}
                `}
          >
            <StrikethroughIcon />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="border rounded-lg flex">
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleBulletList().run();
            }}
            variant="ghost"
            className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("bulletList")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("orderedList") && "rounded-r-none"}
                `}
          >
            <FormatListBulletedRounded />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleOrderedList().run();
            }}
            variant="ghost"
            className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("orderedList")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("bulletList") && "rounded-l-none"}
                `}
          >
            <FormatListNumberedRounded />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().liftListItem("listItem").run();
            }}
            variant="ghost"
            className={`
                hover:bg-transparent hover:text-primary transition-all duration-300`}
          >
            <FormatIndentDecreaseRounded />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().sinkListItem("listItem").run();
            }}
            variant="ghost"
            className={`
                hover:bg-transparent hover:text-primary transition-all duration-300`}
          >
            <FormatIndentIncreaseRounded />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <Select
          onOpenChange={(open) => {
            if (open) {
              setSelectFocused(true);
            } else {
              setTimeout(() => {
                setSelectFocused(false);
              }, 500);
            }
          }}
          onValueChange={(value) => {
            switch (value) {
              case "h2":
                editor?.chain().focus().setHeading({ level: 2 }).run();
                break;
              case "h3":
                editor?.chain().focus().setHeading({ level: 3 }).run();
                break;
              case "h4":
                editor?.chain().focus().setHeading({ level: 4 }).run();
                break;
              case "p":
                editor?.chain().focus().setParagraph().run();
                break;
              default:
                break;
            }

            setTimeout(() => {
              editor?.chain().focus();
            }, 100);
          }}
          value={
            editor?.isActive("heading", { level: 2 })
              ? "h2"
              : editor?.isActive("heading", { level: 3 })
              ? "h3"
              : editor?.isActive("heading", { level: 4 })
              ? "h4"
              : "p"
          }
        >
          <SelectTrigger className="overflow-hidden">
            <SelectValue className="w-full overflow-hidden text-ellipsis whitespace-nowrap" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h2">Nagłówek 1</SelectItem>
            <SelectItem value="h3">Nagłówek 2</SelectItem>
            <SelectItem value="h4">Nagłówek 3</SelectItem>
            <SelectItem value="p">Paragraf</SelectItem>
          </SelectContent>
        </Select>
      </Card>
    );
  }

  return (
    <Card
      className="max-w-md absolute h-12 z-50 left-1/2 -translate-x-1/2 flex items-center px-2 top-2 gap-2 justify-between"
      onTouchStart={() => {
        setCardFocused(true);

        if (focusTimeout) {
          clearTimeout(focusTimeout);
        }

        setFocusTimeout(
          setTimeout(() => {
            setCardFocused(false);
            setFocusTimeout(null);
          }, 500)
        );
      }}
    >
      {step === 0 && (
        <>
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().undo().run();
              }}
              variant="ghost"
              className={`hover:bg-transparent hover:text-primary`}
            >
              <UndoRounded />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().redo().run();
              }}
              variant="ghost"
              className={`hover:bg-transparent hover:text-primary`}
            >
              <RedoRounded />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleBold().run();
              }}
              variant="ghost"
              className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("bold")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("italic") && "rounded-r-none"}`}
            >
              <FontBoldIcon />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleItalic().run();
              }}
              variant="ghost"
              className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("italic")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("bold") && "rounded-l-none"}
                ${editor?.isActive("underline") && "rounded-r-none"}
                `}
            >
              <FontItalicIcon />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleUnderline().run();
              }}
              variant="ghost"
              className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("underline")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("italic") && "rounded-l-none"}
                ${editor?.isActive("strike") && "rounded-r-none"}
                `}
            >
              <UnderlineIcon />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleStrike().run();
              }}
              variant="ghost"
              className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("strike")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("underline") && "rounded-l-none"}
                `}
            >
              <StrikethroughIcon />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                setStep(1);
                editor.chain().focus();
              }}
              variant="ghost"
              className={`hover:bg-transparent hover:text-primary`}
            >
              <CaretRightIcon />
            </Button>
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                setStep(0);
                editor.chain().focus();
              }}
              variant="ghost"
              className={`hover:bg-transparent hover:text-primary`}
            >
              <CaretLeftIcon />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleBulletList().run();
              }}
              variant="ghost"
              className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("bulletList")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("orderedList") && "rounded-r-none"}
                `}
            >
              <FormatListBulletedRounded />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleOrderedList().run();
              }}
              variant="ghost"
              className={`
                hover:bg-transparent
                hover:text-primary
                ${
                  editor?.isActive("orderedList")
                    ? "!bg-primary !text-primary-foreground"
                    : "!bg-transparent !text-secondary-foreground"
                } transition-all duration-300
                ${editor?.isActive("bulletList") && "rounded-l-none"}
                `}
            >
              <FormatListNumberedRounded />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().liftListItem("listItem").run();
              }}
              variant="ghost"
              className={`
                hover:bg-transparent hover:text-primary transition-all duration-300`}
            >
              <FormatIndentDecreaseRounded />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().sinkListItem("listItem").run();
              }}
              variant="ghost"
              className={`
                hover:bg-transparent hover:text-primary transition-all duration-300`}
            >
              <FormatIndentIncreaseRounded />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <Select
            onOpenChange={(open) => {
              if (open) {
                setSelectFocused(true);
              } else {
                setTimeout(() => {
                  setSelectFocused(false);
                }, 500);
              }
            }}
            onValueChange={(value) => {
              switch (value) {
                case "h2":
                  editor?.chain().focus().setHeading({ level: 2 }).run();
                  break;
                case "h3":
                  editor?.chain().focus().setHeading({ level: 3 }).run();
                  break;
                case "h4":
                  editor?.chain().focus().setHeading({ level: 4 }).run();
                  break;
                case "p":
                  editor?.chain().focus().setParagraph().run();
                  break;
                default:
                  break;
              }

              setTimeout(() => {
                editor?.chain().focus();
              }, 100);
            }}
            value={
              editor?.isActive("heading", { level: 2 })
                ? "h2"
                : editor?.isActive("heading", { level: 3 })
                ? "h3"
                : editor?.isActive("heading", { level: 4 })
                ? "h4"
                : "p"
            }
          >
            <SelectTrigger className="overflow-hidden">
              <SelectValue className="w-full overflow-hidden text-ellipsis whitespace-nowrap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h2">Nagłówek 1</SelectItem>
              <SelectItem value="h3">Nagłówek 2</SelectItem>
              <SelectItem value="h4">Nagłówek 3</SelectItem>
              <SelectItem value="p">Paragraf</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
    </Card>
  );
};
