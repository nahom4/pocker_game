import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { History,} from 'lucide-react';
import { Button } from './ui/button';

interface HandHistoryPanelProps {
  history: any[];
  gameStates: any[];
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
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
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
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm">Hand #{index + 1}</CardTitle>
                        <Badge variant={hand.result === 'win' ? 'default' : 'secondary'}>
                          {hand.result || 'Unknown'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pot:</span>
                          <span>${(hand.pot || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Your cards:</span>
                          <span>{hand.playerCards || 'Hidden'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Result:</span>
                          <span className={hand.result === 'win' ? 'text-green-600' : 'text-red-600'}>
                            {hand.result === 'win' ? '+' : '-'}${Math.abs(hand.amount || 0).toLocaleString()}
                          </span>
                        </div>
                        {hand.actions && hand.actions.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="text-muted-foreground text-xs mb-1">Actions:</div>
                            <div className="text-xs space-y-1">
                              {hand.actions.slice(0, 3).map((action: any, actionIndex: number) => (
                                <div key={actionIndex} className="flex justify-between">
                                  <span>{action.player}: {action.action}</span>
                                  {action.amount && <span>${action.amount}</span>}
                                </div>
                              ))}
                              {hand.actions.length > 3 && (
                                <div className="text-muted-foreground">
                                  +{hand.actions.length - 3} more actions
                                </div>
                              )}
                            </div>
                          </div>
                        )}
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