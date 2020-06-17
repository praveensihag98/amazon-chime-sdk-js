const {OpenAppStep, JoinMeetingStep, AuthenticateUserStep, ClickVideoButton, WaitForRemoteVideoCheckToComplete, WaitForRemoteParticipantsToTurnVideoOff, WaitForRemoteParticipantsToTurnVideoOn, WaitForRemoteParticipantsToJoinMeeting, WaitForMeetingToBeCreated} = require('./steps');
const {UserJoinedMeetingCheck, LocalVideoCheck, RemoteVideoCheck, UserAuthenticationCheck, RosterCheck} = require('./checks');
const {AppPage} = require('./pages/AppPage');
const {TestUtils} = require('./node_modules/kite-common');
const SdkBaseTest = require('./utils/SdkBaseTest');
const uuidv4 = require('uuid/v4');

class VideoTestSimulcast extends SdkBaseTest {
  constructor(name, kiteConfig) {
    super(name, kiteConfig, "Video");
  }

  async runIntegrationTest() {
    const session = this.seleniumSessions[0];
    await WaitForMeetingToBeCreated.executeStep(this, session);
    await OpenAppStep.executeStep(this, session);
    await AuthenticateUserStep.executeStep(this, session, this.attendeeId, true);
    await UserAuthenticationCheck.executeStep(this, session);
    await JoinMeetingStep.executeStep(this, session);
    await UserJoinedMeetingCheck.executeStep(this, session, this.attendeeId);
    await WaitForRemoteParticipantsToJoinMeeting.executeStep(this, session);
    await RosterCheck.executeStep(this, session, 2);
    await ClickVideoButton.executeStep(this, session);
    await LocalVideoCheck.executeStep(this, session, 'VIDEO_ON');
    await WaitForRemoteParticipantsToTurnVideoOn.executeStep(this, session);
    await RemoteVideoCheck.executeStep(this, session, 'VIDEO_ON');
    await WaitForRemoteVideoCheckToComplete.executeStep(this, session);
    await ClickVideoButton.executeStep(this, session);
    await LocalVideoCheck.executeStep(this, session, 'VIDEO_OFF');
    await WaitForRemoteParticipantsToTurnVideoOff.executeStep(this, session);
    await RemoteVideoCheck.executeStep(this, session, 'VIDEO_OFF');
    await this.waitAllSteps();
  }
}

module.exports = VideoTestSimulcast;

(async () => {
  const kiteConfig = await TestUtils.getKiteConfig(__dirname);
  let test = new VideoTestSimulcast('Video test simulcast', kiteConfig);
  await test.run();
})();
