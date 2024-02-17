import { useEffect } from "react";
import * as ActionCable from "@rails/actioncable";

const useCable = (channel: any, onReceived: any) => {
  const channelStr = channel ? JSON.stringify(channel) : null;

  useEffect(() => {
    if(channelStr) {
      const _onReceived = (log: any) => {
        try {
          onReceived(JSON.parse(log || '{}'));
        } catch (e) {
          console.warn(e);
        }
      }
      const cable = ActionCable.createConsumer();

      try {
        cable.subscriptions.create(JSON.parse(channelStr), { received: _onReceived });
        console.log('Subscribed to', channel)
      } catch (e) {
        console.log('ActionCable: Cant subscribe', e)
      }

      return () => {
        cable.disconnect();
      };
    }
  }, [channelStr]);
}

export default useCable;