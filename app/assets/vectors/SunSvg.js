import * as React from 'react';
import Svg, {G, Circle, Path} from 'react-native-svg';

export default function SunSvg() {
  return (
    <Svg
      width={17}
      height={17}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.626.557c-.05.035-.098.123-.113.208-.014.08-.104.559-.2 1.062-.096.503-.175.925-.175.938 0 .013.296.024.658.024h.659l-.026-.148a69.067 69.067 0 00-.139-.721 27.03 27.03 0 01-.163-.91C9.09.76 9.054.653 8.987.587 8.883.482 8.75.472 8.626.557zm-3.853.986c-.106.105-.122.23-.053.404a59 59 0 01.339.96l.313.9c.012.033.096-.001.26-.107.134-.085.413-.238.62-.339.434-.21.434-.15-.005-.611a21.397 21.397 0 01-.652-.731 9.247 9.247 0 00-.45-.504c-.112-.097-.257-.086-.372.028zm7.755-.047c-.116.065-1.525 1.625-1.525 1.689 0 .017.117.08.259.14.142.06.405.195.583.3.179.106.335.192.349.192.013 0 .074-.147.136-.326.062-.18.22-.62.348-.981.13-.36.236-.7.236-.757 0-.2-.222-.349-.386-.257zM8.042 3.164a5.286 5.286 0 00-4.32 3.617c-.382 1.165-.364 2.291.057 3.538.409 1.212 1.467 2.388 2.668 2.964.527.253.848.355 1.446.457 1.1.187 2.32.02 3.251-.448 1.509-.757 2.51-2.056 2.89-3.746.079-.35.092-.522.091-1.124 0-.777-.053-1.085-.306-1.799a5.3 5.3 0 00-2.56-2.927 5.669 5.669 0 00-3.217-.532zm.049.812a4.516 4.516 0 00-3.4 2.526c-.311.66-.49 1.569-.44 2.236.139 1.82 1.284 3.367 2.959 3.993.384.143 1.18.295 1.55.295.658 0 1.41-.177 2.033-.477 1.326-.64 2.239-1.873 2.497-3.377.23-1.334-.227-2.834-1.164-3.82A4.517 4.517 0 009.81 4.047c-.426-.091-1.347-.13-1.72-.071zm7.363.214c-.346.12-1.681.63-1.916.73-.132.056-.182.098-.161.132l.166.262c.075.117.192.313.26.436.236.42.193.395.396.23.098-.08.32-.275.494-.433.174-.158.517-.465.762-.682.451-.398.524-.503.448-.644-.064-.12-.174-.127-.45-.03zM1.738 4.18c-.07.07-.058.249.022.34.039.043.24.227.448.408.208.18.599.531.868.778l.49.45.3-.508c.164-.279.315-.537.336-.575.03-.053.014-.08-.073-.123-.233-.118-2.156-.817-2.247-.817a.236.236 0 00-.144.048zm6.397.228c-1.142.206-2.129.83-2.722 1.721-.275.413-.341.548-.517 1.059-.447 1.3-.15 2.847.755 3.928a4.145 4.145 0 002.033 1.306c.364.102.45.11 1.11.11.856 0 1.2-.072 1.816-.378.706-.351 1.205-.786 1.609-1.4.387-.59.579-1.135.658-1.868.215-2.006-1.04-3.838-3.004-4.384-.298-.083-.468-.103-.959-.114a6.192 6.192 0 00-.78.02zM2.148 7.966c-.437.102-.899.208-1.024.235-.34.072-.433.207-.276.4.058.07.191.113.686.216.338.07.836.175 1.107.233.272.057.496.1.5.094.003-.006-.001-.318-.01-.693-.015-.668-.017-.682-.101-.677-.047.002-.444.089-.882.192zm12.302.476c.002.37.013.682.025.693.023.023 1.962-.397 2.134-.462.122-.046.164-.101.165-.219 0-.135-.161-.229-.523-.304-.183-.037-.65-.139-1.039-.225-.388-.085-.72-.156-.736-.156-.016 0-.028.303-.026.673zM3 11.24c-.297.276-.705.652-.908.836-.435.395-.466.441-.401.597.067.161.157.173.422.055a40.968 40.968 0 011.875-.708c.114-.037.219-.084.232-.105.012-.02-.068-.175-.18-.343a5.74 5.74 0 01-.33-.571c-.07-.147-.136-.266-.148-.265a11.51 11.51 0 00-.562.504zm10.91-.282c-.053.123-.2.384-.325.582-.126.198-.216.372-.202.386.015.014.206.088.425.163.39.135 1.076.399 1.552.598.289.12.423.127.516.024.103-.112.054-.238-.167-.437-.41-.369-1.119-1.02-1.386-1.273a3.522 3.522 0 00-.299-.267c-.01 0-.06.101-.114.224zM5.358 13.19c-.32.867-.686 2.029-.665 2.112.023.09.217.214.336.214.02 0 .207-.191.414-.425l.781-.876.406-.45-.47-.244a17.124 17.124 0 01-.618-.334l-.15-.09-.034.093zm6.591.05a6.409 6.409 0 01-.567.32c-.208.106-.379.203-.379.217 0 .014.178.22.394.457.217.238.544.61.729.828.303.358.348.396.485.407.182.015.303-.075.303-.227 0-.057-.125-.468-.277-.913-.329-.963-.419-1.198-.465-1.21-.019-.005-.12.049-.223.12zm-3.812.952c0 .022.071.413.16.87.088.456.17.917.183 1.024a.46.46 0 00.136.306c.13.13.233.141.356.043.072-.059.105-.18.201-.741a21.676 21.676 0 01.318-1.531c0-.034-1.353-.005-1.354.029z"
        fill="#FFBA09"
      />
    </Svg>
  );
}
