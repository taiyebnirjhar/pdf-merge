"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Hero = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]); // Changed type to any[]

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setItems(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const itemsCopy = Array.from(items);
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updateItems = itemsCopy.slice(startIndex, endIndex + 1);
    setItems(itemsCopy);

    // Assuming `onReorder` function is defined somewhere
    const bulkUpdateData = updateItems.map((item) => ({
      id: item.id,
      position: itemsCopy.findIndex((i) => i.id === item.id),
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newItems = Array.from(files).map((file, index) => ({
      id: `pdf-${index}`,
      title: file.name,
    }));
    setItems([...items, ...newItems]);
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    fileInput.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const newItems = Array.from(files).map((file, index) => ({
        id: `pdf-${index}`,
        title: file.name,
      }));
      setItems([...items, ...newItems]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  if (!isMounted) return null;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={"w-full transition h-screen"} // Updated styles to cover the full page
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={"items"} direction={"horizontal"}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="w-full h-full bg-secondary"
            >
              {/* Initial Hero */}
              <div className="flex flex-col items-center justify-center pt-10">
                <h1 className="text-[42px] font-semibold">Merge PDF files</h1>
                <h3 className="text-[22px] font-base mt-2 mb-8">
                  Combine PDFs in the order you want with the easiest PDF merger
                  available.
                </h3>
                <Button
                  onClick={handleButtonClick}
                  variant={"default"}
                  size={"lg"}
                  className={cn(
                    "text-[24px] font-medium w-[330px] h-20 rounded-lg",
                    items.length > 0 && ""
                  )}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    id="file-input"
                    onChange={handleFileChange}
                    className={"hidden"}
                  />
                  Select PDF Files
                </Button>
                <p className="text-sm mt-3 text-muted-foreground">
                  or drop PDFs here
                </p>
              </div>

              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={
                        "w-40 h-40 transition-transform transform hover:scale-105"
                      }
                    >
                      {/*  image will be shown here  */}
                      {index} - {item.title}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Hero;
