import { useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, MapPin, Trash2, GripVertical } from 'lucide-react'
import { useTripStore } from '@/store/tripStore'
import { useUIStore } from '@/store/uiStore'
import { formatTime, formatDuration, checkBusinessHours } from '@/lib/utils'
import { Button } from '@/components/common'
import type { ItineraryItem, Place } from '@/types'

interface ItineraryTimelineProps {
  dayNumber: number
}

interface TimelineItemProps {
  item: ItineraryItem
  place?: Place
  onRemove: (id: string) => void
}

function TimelineItem({ item, place, onRemove }: TimelineItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const businessHoursStatus = useMemo(() => {
    if (!place?.businessHours) return null
    return checkBusinessHours(item.startTime, place.businessHours.open, place.businessHours.close)
  }, [item.startTime, place])

  const statusColors = {
    green: 'bg-success',
    yellow: 'bg-warning',
    red: 'bg-destructive',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      {/* Timeline Connector */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      {/* Timeline Item */}
      <div className="relative pl-10 pb-6">
        {/* Time Dot */}
        <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center">
          <Clock className="h-4 w-4 text-primary" />
        </div>

        {/* Content Card */}
        <div className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Time */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{formatTime(item.startTime)}</span>
                <span>-</span>
                <span>{formatTime(item.endTime)}</span>
                {businessHoursStatus && (
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${statusColors[businessHoursStatus]}`}
                    title={`Business hours: ${businessHoursStatus}`}
                  />
                )}
              </div>

              {/* Place Name */}
              <h4 className="font-semibold mb-1">{place?.name || 'Unknown Place'}</h4>

              {/* Description */}
              {place?.description && (
                <p className="text-sm text-muted-foreground mb-2">{place.description}</p>
              )}

              {/* Details */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="capitalize">{place?.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(place?.estimatedDuration || 60)}</span>
                </div>
              </div>

              {/* Travel Time (if any) */}
              {item.travelDuration && item.travelDuration > 0 && (
                <div className="mt-2 pt-2 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{item.travelMode}</span>
                  <span>•</span>
                  <span>{formatDuration(item.travelDuration)} travel time</span>
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <p className="mt-2 text-sm text-muted-foreground italic">{item.notes}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Drag Handle */}
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ItineraryTimeline({ dayNumber }: ItineraryTimelineProps) {
  const itineraryItems = useTripStore((state) => state.itineraryItems)
  const places = useTripStore((state) => state.places)
  const reorderItineraryItems = useTripStore((state) => state.reorderItineraryItems)
  const removeItineraryItem = useTripStore((state) => state.removeItineraryItem)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter items for this day and sort by order
  const dayItems = useMemo(() => {
    return itineraryItems
      .filter((item) => item.dayNumber === dayNumber)
      .sort((a, b) => a.order - b.order)
  }, [itineraryItems, dayNumber])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = dayItems.findIndex((item) => item.id === active.id)
    const newIndex = dayItems.findIndex((item) => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reorderedDayItems = arrayMove(dayItems, oldIndex, newIndex)

    // Update order property
    const updatedItems = reorderedDayItems.map((item, index) => ({
      ...item,
      order: index,
    }))

    // Merge with other days' items
    const otherDaysItems = itineraryItems.filter((item) => item.dayNumber !== dayNumber)
    reorderItineraryItems([...otherDaysItems, ...updatedItems])
  }

  const handleRemoveItem = (itemId: string) => {
    removeItineraryItem(itemId)
  }

  const getPlaceById = (placeId: string | undefined): Place | undefined => {
    if (!placeId) return undefined
    return places.find((p) => p.id === placeId)
  }

  if (dayItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No activities for this day</p>
          <p className="text-sm text-muted-foreground mt-1">Add places to build your itinerary</p>
        </div>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={dayItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-0">
          {dayItems.map((item) => (
            <TimelineItem
              key={item.id}
              item={item}
              place={getPlaceById(item.placeId)}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
