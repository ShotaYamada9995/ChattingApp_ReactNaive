import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';

export const trim = async (
  source: string,
  startTime: string,
  endTime: string,
) => {
  const trimmedVideoPath = `${source}_trimmed_0.mp4`;

  const session = await FFmpegKit.execute(
    `-y -i ${source}.mp4 -ss ${startTime} -to ${endTime} -c:v copy -c:a copy ${trimmedVideoPath}`,
  );

  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    // SUCCESS
    console.log('Success');
    return trimmedVideoPath;
  } else if (ReturnCode.isCancel(returnCode)) {
    // CANCEL
    console.log('Cancelled');
  } else {
    // ERROR
    console.log('Error');
  }
};

export const genFrames = async (source: string) => {
  const framePath = `${source}_frame_%4d.png`;

  const session = await FFmpegKit.execute(
    `-i ${source}.mp4 -vf fps=10 ${framePath}`,
  );

  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    // SUCCESS
    return 'success';
  } else if (ReturnCode.isCancel(returnCode)) {
    // CANCEL
    return 'cancelled';
  } else {
    // ERROR
    return 'error';
  }
};
