import { WebNotificationModule } from './web-notification.module'

describe('NotificationModule', () => {
  let notificationModule: WebNotificationModule

  beforeEach(() => {
    notificationModule = new WebNotificationModule()
  })

  it('should create an instance', () => {
    expect(notificationModule).toBeTruthy()
  })
})
