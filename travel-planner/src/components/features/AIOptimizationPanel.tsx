import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles, Check, X, ArrowRight, Plus, Trash2, Edit } from 'lucide-react'
import { Modal, Button } from '@/components/common'
import { useUIStore } from '@/store/uiStore'
import { useTripStore } from '@/store/tripStore'
import type { OptimizationSuggestion } from '@/types'

export function AIOptimizationPanel() {
  const { t } = useTranslation()
  const isOpen = useUIStore((state) => state.aiPreviewOpen)
  const setAiPreviewOpen = useUIStore((state) => state.setAiPreviewOpen)
  const optimizationResult = useUIStore((state) => state.optimizationResult)
  const isOptimizing = useUIStore((state) => state.isOptimizing)
  const setIsOptimizing = useUIStore((state) => state.setIsOptimizing)

  const [selectedMode, setSelectedMode] = useState<'optimize-only' | 'suggest-and-optimize'>(
    'optimize-only'
  )

  const handleOptimize = async () => {
    setIsOptimizing(true)
    try {
      // TODO: API call to optimize
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock result
      const mockResult = {
        suggestions: [
          {
            type: 'reorder' as const,
            itemId: '1',
            newOrder: 2,
            reasoning: 'Moving this activity later reduces total travel time by 15 minutes',
          },
          {
            type: 'add' as const,
            newPlace: {
              name: 'Local Café',
              category: 'restaurant' as const,
              latitude: 37.5665,
              longitude: 126.978,
            },
            newDay: 1,
            reasoning: 'This café is on the way and highly rated for breakfast',
          },
        ],
        reasoning:
          'Optimized route to minimize travel time while respecting business hours. Suggested one additional stop that fits well with your schedule.',
        estimatedTimeSaved: 25,
        estimatedDistanceSaved: 1200,
      }

      useUIStore.setState({ optimizationResult: mockResult })
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleApply = () => {
    // TODO: Apply optimization changes
    console.log('Applying optimization')
    setAiPreviewOpen(false)
  }

  const handleReject = () => {
    useUIStore.setState({ optimizationResult: null })
    setAiPreviewOpen(false)
  }

  const getSuggestionIcon = (type: OptimizationSuggestion['type']) => {
    switch (type) {
      case 'add':
        return <Plus className="h-4 w-4" />
      case 'remove':
        return <Trash2 className="h-4 w-4" />
      case 'reorder':
        return <ArrowRight className="h-4 w-4" />
      case 'modify':
        return <Edit className="h-4 w-4" />
    }
  }

  const getSuggestionColor = (type: OptimizationSuggestion['type']) => {
    switch (type) {
      case 'add':
        return 'text-success'
      case 'remove':
        return 'text-destructive'
      case 'reorder':
        return 'text-primary'
      case 'modify':
        return 'text-warning'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setAiPreviewOpen(false)} title={t('ai.preview')} size="xl">
      <div className="space-y-6">
        {!optimizationResult && !isOptimizing && (
          <>
            {/* Mode Selection */}
            <div>
              <h3 className="text-sm font-medium mb-4">Optimization Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedMode('optimize-only')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedMode === 'optimize-only'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted'
                  }`}
                >
                  <h4 className="font-semibold mb-1">{t('ai.optimizeOnly')}</h4>
                  <p className="text-sm text-muted-foreground">
                    Reorder existing places to minimize travel time
                  </p>
                </button>

                <button
                  onClick={() => setSelectedMode('suggest-and-optimize')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedMode === 'suggest-and-optimize'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted'
                  }`}
                >
                  <h4 className="font-semibold mb-1">{t('ai.suggestAndOptimize')}</h4>
                  <p className="text-sm text-muted-foreground">
                    Add new recommendations and optimize the schedule
                  </p>
                </button>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center pt-4">
              <Button onClick={handleOptimize} size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                {t('ai.optimize')}
              </Button>
            </div>
          </>
        )}

        {isOptimizing && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 animate-pulse">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('ai.optimizing')}</h3>
            <p className="text-muted-foreground">Analyzing your itinerary...</p>
          </div>
        )}

        {optimizationResult && !isOptimizing && (
          <>
            {/* Summary */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">AI Recommendation</h3>
                  <p className="text-sm text-muted-foreground">{optimizationResult.reasoning}</p>

                  {(optimizationResult.estimatedTimeSaved || optimizationResult.estimatedDistanceSaved) && (
                    <div className="flex gap-4 mt-3 text-sm">
                      {optimizationResult.estimatedTimeSaved && (
                        <div>
                          <span className="text-muted-foreground">Time saved: </span>
                          <span className="font-semibold text-success">
                            {optimizationResult.estimatedTimeSaved} min
                          </span>
                        </div>
                      )}
                      {optimizationResult.estimatedDistanceSaved && (
                        <div>
                          <span className="text-muted-foreground">Distance saved: </span>
                          <span className="font-semibold text-success">
                            {(optimizationResult.estimatedDistanceSaved / 1000).toFixed(1)} km
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions List */}
            <div>
              <h3 className="text-sm font-medium mb-4">
                Suggested Changes ({optimizationResult.suggestions.length})
              </h3>
              <div className="space-y-3">
                {optimizationResult.suggestions.map((suggestion, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${getSuggestionColor(suggestion.type)}`}>
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold capitalize">{suggestion.type}</span>
                          {suggestion.newPlace && (
                            <span className="text-sm">- {suggestion.newPlace.name}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Button onClick={handleApply}>
                <Check className="h-4 w-4 mr-2" />
                {t('ai.apply')}
              </Button>
              <Button variant="outline" onClick={handleReject}>
                <X className="h-4 w-4 mr-2" />
                {t('ai.reject')}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
