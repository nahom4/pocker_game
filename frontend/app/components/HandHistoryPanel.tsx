import React from 'react'; 
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { History } from 'lucide-react';
import { Button } from './ui/button';

interface HandHistoryPanelProps {
  history: any[];
  fetchHandHistory: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const HandHistoryPanel: React.FC<HandHistoryPanelProps> = ({
  history,
  fetchHandHistory,
  isOpen,
  onClose
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[500px] sm:w-[600px] bg-gray-200 p-4">
        <SheetHeader className='my-5'>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Hand History
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchHandHistory}
            >
              Refresh
            </Button>
          </div>
        </SheetHeader>
        
        <div className="mt-6">
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-4 pr-4">
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No hand history available
                </div>
              ) : (
                history.map((hand, index) => (
                  <Card key={hand.hand_uuid || index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Hand #{index + 1} – ID: {hand.hand_uuid}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm space-y-2">

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dealer:</span>
                        <span>{hand.dealer}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Small Blind:</span>
                        <span>{hand.small_blind}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Big Blind:</span>
                        <span>{hand.big_blind}</span>
                      </div>

                      <div>
                        <div className="text-muted-foreground mb-1">Players Hand:</div>
                        <div className="flex flex-wrap gap-2">
                          {hand.players_hand?.map((card: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white rounded border text-xs">
                              {card}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-muted-foreground mb-1">Actions:</div>
                        <div className="flex flex-wrap gap-2">
                          {hand.actions?.map((action: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs whitespace-nowrap">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-muted-foreground mb-1">Winnings:</div>
                        <div className="flex flex-wrap gap-2">
                          {hand.winnings?.map((win: number, i: number) => (
                            <span key={i} className="px-2 py-1 bg-green-100 rounded text-xs whitespace-nowrap">
                              ${win}
                            </span>
                          ))}
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HandHistoryPanel;
