import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/app'
import { waveInit } from './lib'
import { Debounce } from '@/utils/helper'
import { Wavery } from './lib/wave'
import { changeHsl, hexToRgb, rgbToHsl } from '@/utils/color'

export const OPACITY_ARR = [0.265, 0.4, 0.53, 1]
export const topColors = ['#03C79C', '#00A5B2', '#0080A5', '#005A8D']
export const bottomColors = ['#9C1EFF', '#8518E9', '#6F12D3', '#590ABD']
export const MAX_WAVES = 4

@Component
export default class DestructionTheme extends Vue {
  iconWidth = 667
  iconHeight = 684
  test = 1

  wave = {
    height: 300,
    width: 1200,
    segmentCount: 5,
    layerCount: 4,
    variance: 1,
    animation: {
      steps: 2,
      time: 40000
    }
  }

  screen = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  get topColor() {
    return '#03C79C'
  }

  get bottomColor() {
    return '#9C1EFF'
  }

  get topColors() {
    return this.generateArrayColors(this.topColor)
  }

  get bottomColors() {
    return this.generateArrayColors(this.bottomColor)
  }

  generateArrayColors(color: string) {
    const initHSL = rgbToHsl(hexToRgb(color))
    const second = changeHsl(initHSL, 17, 3, -5)
    const third = changeHsl(initHSL, 26, 3, -8)
    const thourd = changeHsl(initHSL, 35, 3, -12)

    return [initHSL, second, third, thourd]
  }

  get animationSpeed() {
    return AppModule.getThemeInput('animation-speed')?.value as number || 40
  }

  get width() {
    return this.screen.width
  }

  get height() {
    return this.screen.height
  }

  get viewBox() {
    return `0 0 ${this.width} ${this.height}`
  }

  get topWaves() {
    return this.generateWave('top')
  }

  get bottomWaves() {
    return this.generateWave('bottom')
  }

  mounted() {
    this.updateScreen()
    window.addEventListener('resize', this.updateScreen)
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.updateScreen)
  }

  @Debounce(50)
  updateScreen() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  generateWave(type: 'bottom' | 'top') {
    const wavery = new Wavery(this.wave)
    const waveSvg = wavery.generateSvg()

    const { height, width, xmlns, paths } = waveSvg.svg
    const isTop = type === 'top'
    const colorsArray = isTop ? topColors : bottomColors
    const angle = Math.atan(window.innerHeight / window.innerWidth) * (180 / Math.PI) * 1.1

    return <svg
      class={`waves--${type}`}
      style={`width: ${width}px; height: ${height}px; --angle: ${angle}deg`}
      viewBox={`0 0 ${width} ${height}`}
      xmlns={xmlns}
    >
      {paths.map((path, index) => {
        const pathProps = []

        if (path.animatedPath) {
          pathProps.push(<style>{wavery.generateAnimationStyle(index)}</style>)
        }

        pathProps.push(
          <path
            key={index}
            d={path.d}
            stroke={path.strokeColor}
            strokeWidth={path.strokeWidth}
            fill={colorsArray[index]}
            class={`path-${index}`}
            transform={path.transform}
          ></path>
        )

        return pathProps
      })}
    </svg>
  }

  render() {
    return <div>
      { this.topWaves }
      { this.bottomWaves }
      <svg
        width={this.width}
        height={this.height}
        viewBox={this.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={this.width} height={this.height} fill="#22233D"/>
        <mask id="mask-agida" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width={this.width} height={this.height}>
          <g id="main" style={`transform: translate(calc(${this.width / 2}px - ${this.iconWidth / 2}px), calc(${this.height / 2}px - ${this.iconHeight / 2}px))`}>
            <path d="M237.103 618.424C214.805 622.652 205.194 620.602 185.075 607.788C175.872 601.813 166.581 593.101 166.581 593.101C224.081 607.788 268.081 566.618 294.255 571.01C313.484 574.236 340.101 591.001 340.101 591.001L340.581 607.531C330.073 607.531 303.866 631.11 289.77 653.664C285.157 660.968 279.391 669.041 276.828 671.604C269.267 679.165 253.89 685.059 245.56 683.522C244.38 683.241 243.644 682.984 243.254 682.537C242.754 681.963 242.822 681.076 243.254 679.421C245.945 667.76 259.528 648.282 274.777 633.545C285.798 623.037 288.873 620.987 306.045 612.273C329.752 600.099 330.649 599.586 328.214 596.639C326.548 594.717 324.754 594.46 315.399 595.101C306.686 595.742 301.944 596.895 292.077 600.996C275.29 607.916 249.789 615.989 237.103 618.424Z" fill="white"/>
            <path d="M442.981 618.362C465.279 622.591 474.89 620.54 495.009 607.726C504.212 601.752 513.503 593.039 513.503 593.039C456.003 607.726 412.003 566.557 385.829 570.948C366.6 574.174 339.983 590.939 339.983 590.939L339.503 607.47C350.011 607.47 376.218 631.048 390.314 653.602C394.927 660.906 400.693 668.98 403.256 671.542C410.817 679.103 426.194 684.998 434.524 683.46C435.704 683.179 436.44 682.923 436.83 682.475C437.33 681.902 437.262 681.014 436.83 679.359C434.139 667.698 420.556 648.22 405.307 633.483C394.286 622.975 391.211 620.925 374.039 612.211C350.332 600.037 349.435 599.525 351.87 596.577C353.536 594.655 355.33 594.399 364.685 595.039C373.398 595.68 378.14 596.833 388.007 600.934C404.794 607.854 430.295 615.927 442.981 618.362Z" fill="white"/>
            <path d="M327.581 90H302.942L289.871 68.1809L277.441 90H252.709L277.056 43.7891L252.581 0H276.928L289.871 21.1218L303.326 0H327.581L303.763 43.7891L327.581 90Z" fill="white"/>
            <path d="M402.581 90H377.942L364.871 68.1809L352.441 90H327.709L352.056 43.7891L327.581 0H351.928L364.871 21.1218L378.326 0H402.581L378.763 43.7891L402.581 90Z" fill="white"/>
            <path d="M426.581 90H402.581V0H426.581V90Z" fill="white"/>
            <path d="M337.101 422.712L317.005 445.056L265.711 387.972H305.635L337.101 422.712Z" fill="white"/>
            <path d="M372.241 388.636L319.474 447.306L372.992 506.811H413.038L359.52 447.306L412.287 388.636H372.241Z" fill="white"/>
            <path d="M337.101 472.217L317.005 449.873L265.711 506.957H305.635L337.101 472.217Z" fill="white"/>
            <path d="M429.561 234.452C429.561 210.159 443.443 190.464 473.657 190.464C527.552 190.464 525.399 169.224 525.399 169.224L522.168 210.444C522.168 234.738 502.426 254.432 478.072 254.432C424.177 254.432 427.407 271.175 427.407 271.175L429.561 234.452Z" fill="white"/>
            <path d="M249.6 234.452C249.6 210.159 235.718 190.464 205.504 190.464C151.609 190.464 153.762 169.224 153.762 169.224L156.993 210.444C156.993 234.738 176.735 254.432 201.089 254.432C254.984 254.432 251.754 271.175 251.754 271.175L249.6 234.452Z" fill="white"/>
            <path d="M175.831 499.349C175.831 499.349 204.587 522.632 220.863 535.811C237.14 548.99 226.751 577.893 226.751 577.893C226.751 577.893 196.432 553.344 183.349 542.751C170.267 532.158 175.831 499.349 175.831 499.349Z" fill="white"/>
            <path d="M129.581 542.962C129.581 542.962 158.336 566.246 174.613 579.425C190.889 592.604 216.999 576.43 216.999 576.43C216.999 576.43 186.679 551.881 173.597 541.288C160.515 530.695 129.581 542.962 129.581 542.962Z" fill="white"/>
            <path d="M119.491 444.189C119.491 444.189 144.725 471.249 159.008 486.566C173.291 501.882 158.98 529.057 158.98 529.057C158.98 529.057 132.373 500.526 120.893 488.215C109.413 475.904 119.491 444.189 119.491 444.189Z" fill="white"/>
            <path d="M67.6186 480.938C67.6186 480.938 92.8526 507.998 107.136 523.315C121.419 538.632 149.526 526.251 149.526 526.251C149.526 526.251 122.92 497.719 111.439 485.408C99.9593 473.097 67.6186 480.938 67.6186 480.938Z" fill="white"/>
            <path d="M84.2195 377.825C84.2195 377.825 101.017 410.792 110.525 429.452C120.033 448.112 98.7855 470.29 98.7855 470.29C98.7855 470.29 81.0744 435.53 73.4324 420.532C65.7903 405.533 84.2195 377.825 84.2195 377.825Z" fill="white"/>
            <path d="M24.2272 398.852C24.2272 398.852 41.0249 431.82 50.5328 450.48C60.0407 469.14 90.4716 464.986 90.4716 464.986C90.4716 464.986 72.7604 430.226 65.1184 415.228C57.4764 400.23 24.2272 398.852 24.2272 398.852Z" fill="white"/>
            <path d="M69.8565 303.224C69.8565 303.224 76.2815 339.662 79.9182 360.287C83.555 380.912 56.7518 395.908 56.7518 395.908C56.7518 395.908 49.9774 357.489 47.0544 340.911C44.1314 324.334 69.8565 303.224 69.8565 303.224Z" fill="white"/>
            <path d="M6.33756 305.793C6.33756 305.793 12.7625 342.231 16.3992 362.856C20.036 383.481 50.3517 388.405 50.3517 388.405C50.3517 388.405 43.5773 349.986 40.6543 333.409C37.7312 316.831 6.33756 305.793 6.33756 305.793Z" fill="white"/>
            <path d="M75.4565 228.242C75.4565 228.242 70.3071 264.882 67.3924 285.621C64.4777 306.361 34.3524 312.34 34.3524 312.34C34.3524 312.34 39.7818 273.708 42.1245 257.038C44.4672 240.369 75.4565 228.242 75.4565 228.242Z" fill="white"/>
            <path d="M14.2527 211.057C14.2527 211.057 9.10328 247.697 6.18858 268.436C3.27388 289.175 30.5841 303.227 30.5841 303.227C30.5841 303.227 36.0135 264.595 38.3562 247.925C40.6989 231.256 14.2527 211.057 14.2527 211.057Z" fill="white"/>
            <path d="M106.484 160.035C106.484 160.035 89.6863 193.002 80.1784 211.662C70.6705 230.323 40.2396 226.169 40.2396 226.169C40.2396 226.169 57.9507 191.409 65.5928 176.41C73.2348 161.412 106.484 160.035 106.484 160.035Z" fill="white"/>
            <path d="M54.2094 123.86C54.2094 123.86 37.4117 156.827 27.9038 175.487C18.3959 194.148 39.6434 216.325 39.6434 216.325C39.6434 216.325 57.3545 181.565 64.9966 166.567C72.6386 151.568 54.2094 123.86 54.2094 123.86Z" fill="white"/>
            <path d="M152.325 97.6303C152.325 97.6303 129.545 126.787 116.651 143.29C103.758 159.793 74.6785 149.909 74.6785 149.909C74.6785 149.909 98.6968 119.167 109.06 105.903C119.424 92.6379 152.325 97.6303 152.325 97.6303Z" fill="white"/>
            <path d="M107.913 52.1456C107.913 52.1456 85.1336 81.3019 72.2398 97.8052C59.346 114.309 75.9715 140.133 75.9715 140.133C75.9715 140.133 99.9897 109.391 110.353 96.1261C120.717 82.8615 107.913 52.1456 107.913 52.1456Z" fill="white"/>
            <path d="M209.082 48.9768C209.082 48.9768 179.532 71.244 162.806 83.8478C146.08 96.4516 120.55 79.3779 120.55 79.3779C120.55 79.3779 151.707 55.8999 165.15 45.7695C178.594 35.6391 209.082 48.9768 209.082 48.9768Z" fill="white"/>
            <path d="M175.831 499.349C175.831 499.349 204.587 522.632 220.863 535.811C237.14 548.99 226.751 577.893 226.751 577.893C226.751 577.893 196.432 553.344 183.349 542.751C170.267 532.158 175.831 499.349 175.831 499.349Z" fill="white"/>
            <path d="M129.581 542.962C129.581 542.962 158.336 566.246 174.613 579.425C190.889 592.604 216.999 576.43 216.999 576.43C216.999 576.43 186.679 551.881 173.597 541.288C160.515 530.695 129.581 542.962 129.581 542.962Z" fill="white"/>
            <path d="M119.491 444.189C119.491 444.189 144.725 471.249 159.008 486.566C173.291 501.882 158.98 529.057 158.98 529.057C158.98 529.057 132.373 500.526 120.893 488.215C109.413 475.904 119.491 444.189 119.491 444.189Z" fill="white"/>
            <path d="M67.6186 480.938C67.6186 480.938 92.8526 507.998 107.136 523.315C121.419 538.632 149.526 526.251 149.526 526.251C149.526 526.251 122.92 497.719 111.439 485.408C99.9593 473.097 67.6186 480.938 67.6186 480.938Z" fill="white"/>
            <path d="M84.2195 377.825C84.2195 377.825 101.017 410.792 110.525 429.452C120.033 448.112 98.7855 470.29 98.7855 470.29C98.7855 470.29 81.0744 435.53 73.4324 420.532C65.7903 405.533 84.2195 377.825 84.2195 377.825Z" fill="white"/>
            <path d="M24.2272 398.852C24.2272 398.852 41.0249 431.82 50.5328 450.48C60.0407 469.14 90.4716 464.986 90.4716 464.986C90.4716 464.986 72.7604 430.226 65.1184 415.228C57.4764 400.23 24.2272 398.852 24.2272 398.852Z" fill="white"/>
            <path d="M69.8565 303.224C69.8565 303.224 76.2815 339.662 79.9182 360.287C83.555 380.912 56.7518 395.908 56.7518 395.908C56.7518 395.908 49.9774 357.489 47.0544 340.911C44.1314 324.334 69.8565 303.224 69.8565 303.224Z" fill="white"/>
            <path d="M6.33756 305.793C6.33756 305.793 12.7625 342.231 16.3992 362.856C20.036 383.481 50.3517 388.405 50.3517 388.405C50.3517 388.405 43.5773 349.986 40.6543 333.409C37.7312 316.831 6.33756 305.793 6.33756 305.793Z" fill="white"/>
            <path d="M75.4565 228.242C75.4565 228.242 70.3071 264.882 67.3924 285.621C64.4777 306.361 34.3524 312.34 34.3524 312.34C34.3524 312.34 39.7818 273.708 42.1245 257.038C44.4672 240.369 75.4565 228.242 75.4565 228.242Z" fill="white"/>
            <path d="M14.2527 211.057C14.2527 211.057 9.10328 247.697 6.18858 268.436C3.27388 289.175 30.5841 303.227 30.5841 303.227C30.5841 303.227 36.0135 264.595 38.3562 247.925C40.6989 231.256 14.2527 211.057 14.2527 211.057Z" fill="white"/>
            <path d="M106.484 160.035C106.484 160.035 89.6863 193.002 80.1784 211.662C70.6705 230.323 40.2396 226.169 40.2396 226.169C40.2396 226.169 57.9507 191.409 65.5928 176.41C73.2348 161.412 106.484 160.035 106.484 160.035Z" fill="white"/>
            <path d="M54.2094 123.86C54.2094 123.86 37.4117 156.827 27.9038 175.487C18.3959 194.148 39.6434 216.325 39.6434 216.325C39.6434 216.325 57.3545 181.565 64.9966 166.567C72.6386 151.568 54.2094 123.86 54.2094 123.86Z" fill="white"/>
            <path d="M152.325 97.6303C152.325 97.6303 129.545 126.787 116.651 143.29C103.758 159.793 74.6785 149.909 74.6785 149.909C74.6785 149.909 98.6968 119.167 109.06 105.903C119.424 92.6379 152.325 97.6303 152.325 97.6303Z" fill="white"/>
            <path d="M107.913 52.1456C107.913 52.1456 85.1336 81.3019 72.2398 97.8052C59.346 114.309 75.9715 140.133 75.9715 140.133C75.9715 140.133 99.9897 109.391 110.353 96.1261C120.717 82.8615 107.913 52.1456 107.913 52.1456Z" fill="white"/>
            <path d="M209.082 48.9768C209.082 48.9768 179.532 71.244 162.806 83.8478C146.08 96.4516 120.55 79.3779 120.55 79.3779C120.55 79.3779 151.707 55.8999 165.15 45.7695C178.594 35.6391 209.082 48.9768 209.082 48.9768Z" fill="white"/>
            <path d="M503.749 499.349C503.749 499.349 474.994 522.632 458.717 535.811C442.441 548.99 452.83 577.893 452.83 577.893C452.83 577.893 483.149 553.344 496.231 542.751C509.313 532.158 503.749 499.349 503.749 499.349Z" fill="white"/>
            <path d="M550 542.962C550 542.962 521.244 566.246 504.968 579.425C488.692 592.604 462.582 576.43 462.582 576.43C462.582 576.43 492.901 551.881 505.984 541.288C519.066 530.695 550 542.962 550 542.962Z" fill="white"/>
            <path d="M560.09 444.189C560.09 444.189 534.856 471.249 520.573 486.566C506.289 501.882 520.601 529.057 520.601 529.057C520.601 529.057 547.207 500.526 558.687 488.215C570.167 475.904 560.09 444.189 560.09 444.189Z" fill="white"/>
            <path d="M611.962 480.938C611.962 480.938 586.728 507.998 572.445 523.315C558.162 538.632 530.055 526.251 530.055 526.251C530.055 526.251 556.661 497.719 568.141 485.408C579.621 473.097 611.962 480.938 611.962 480.938Z" fill="white"/>
            <path d="M595.361 377.825C595.361 377.825 578.563 410.792 569.055 429.452C559.548 448.112 580.795 470.29 580.795 470.29C580.795 470.29 598.506 435.53 606.148 420.532C613.79 405.533 595.361 377.825 595.361 377.825Z" fill="white"/>
            <path d="M655.353 398.852C655.353 398.852 638.556 431.82 629.048 450.48C619.54 469.14 589.109 464.986 589.109 464.986C589.109 464.986 606.82 430.226 614.462 415.228C622.104 400.23 655.353 398.852 655.353 398.852Z" fill="white"/>
            <path d="M609.724 303.224C609.724 303.224 603.299 339.662 599.662 360.287C596.026 380.912 622.829 395.908 622.829 395.908C622.829 395.908 629.603 357.489 632.526 340.911C635.449 324.334 609.724 303.224 609.724 303.224Z" fill="white"/>
            <path d="M673.243 305.793C673.243 305.793 666.818 342.231 663.181 362.856C659.545 383.481 629.229 388.405 629.229 388.405C629.229 388.405 636.003 349.986 638.926 333.409C641.849 316.831 673.243 305.793 673.243 305.793Z" fill="white"/>
            <path d="M604.124 228.242C604.124 228.242 609.273 264.882 612.188 285.621C615.103 306.361 645.228 312.34 645.228 312.34C645.228 312.34 639.799 273.708 637.456 257.038C635.113 240.369 604.124 228.242 604.124 228.242Z" fill="white"/>
            <path d="M665.328 211.057C665.328 211.057 670.477 247.697 673.392 268.436C676.307 289.175 648.997 303.227 648.997 303.227C648.997 303.227 643.567 264.595 641.224 247.925C638.882 231.256 665.328 211.057 665.328 211.057Z" fill="white"/>
            <path d="M573.097 160.035C573.097 160.035 589.894 193.002 599.402 211.662C608.91 230.323 639.341 226.169 639.341 226.169C639.341 226.169 621.63 191.409 613.988 176.41C606.346 161.412 573.097 160.035 573.097 160.035Z" fill="white"/>
            <path d="M625.371 123.86C625.371 123.86 642.169 156.827 651.677 175.487C661.185 194.148 639.937 216.325 639.937 216.325C639.937 216.325 622.226 181.565 614.584 166.567C606.942 151.568 625.371 123.86 625.371 123.86Z" fill="white"/>
            <path d="M527.256 97.6303C527.256 97.6303 550.035 126.787 562.929 143.29C575.823 159.793 604.902 149.909 604.902 149.909C604.902 149.909 580.884 119.167 570.52 105.903C560.157 92.6379 527.256 97.6303 527.256 97.6303Z" fill="white"/>
            <path d="M571.667 52.1456C571.667 52.1456 594.447 81.3019 607.341 97.8052C620.235 114.309 603.609 140.133 603.609 140.133C603.609 140.133 579.591 109.391 569.227 96.1261C558.864 82.8615 571.667 52.1456 571.667 52.1456Z" fill="white"/>
            <path d="M470.499 48.9768C470.499 48.9768 500.049 71.244 516.774 83.8478C533.5 96.4516 559.03 79.3779 559.03 79.3779C559.03 79.3779 527.874 55.8999 514.43 45.7695C500.987 35.6391 470.499 48.9768 470.499 48.9768Z" fill="white"/>
            <path d="M503.749 499.349C503.749 499.349 474.994 522.632 458.717 535.811C442.441 548.99 452.83 577.893 452.83 577.893C452.83 577.893 483.149 553.344 496.231 542.751C509.313 532.158 503.749 499.349 503.749 499.349Z" fill="white"/>
            <path d="M550 542.962C550 542.962 521.244 566.246 504.968 579.425C488.692 592.604 462.582 576.43 462.582 576.43C462.582 576.43 492.901 551.881 505.984 541.288C519.066 530.695 550 542.962 550 542.962Z" fill="white"/>
            <path d="M560.09 444.189C560.09 444.189 534.856 471.249 520.573 486.566C506.289 501.882 520.601 529.057 520.601 529.057C520.601 529.057 547.207 500.526 558.687 488.215C570.167 475.904 560.09 444.189 560.09 444.189Z" fill="white"/>
            <path d="M611.962 480.938C611.962 480.938 586.728 507.998 572.445 523.315C558.162 538.632 530.055 526.251 530.055 526.251C530.055 526.251 556.661 497.719 568.141 485.408C579.621 473.097 611.962 480.938 611.962 480.938Z" fill="white"/>
            <path d="M595.361 377.825C595.361 377.825 578.563 410.792 569.055 429.452C559.548 448.112 580.795 470.29 580.795 470.29C580.795 470.29 598.506 435.53 606.148 420.532C613.79 405.533 595.361 377.825 595.361 377.825Z" fill="white"/>
            <path d="M655.353 398.852C655.353 398.852 638.556 431.82 629.048 450.48C619.54 469.14 589.109 464.986 589.109 464.986C589.109 464.986 606.82 430.226 614.462 415.228C622.104 400.23 655.353 398.852 655.353 398.852Z" fill="white"/>
            <path d="M609.724 303.224C609.724 303.224 603.299 339.662 599.662 360.287C596.026 380.912 622.829 395.908 622.829 395.908C622.829 395.908 629.603 357.489 632.526 340.911C635.449 324.334 609.724 303.224 609.724 303.224Z" fill="white"/>
            <path d="M673.243 305.793C673.243 305.793 666.818 342.231 663.181 362.856C659.545 383.481 629.229 388.405 629.229 388.405C629.229 388.405 636.003 349.986 638.926 333.409C641.849 316.831 673.243 305.793 673.243 305.793Z" fill="white"/>
            <path d="M604.124 228.242C604.124 228.242 609.273 264.882 612.188 285.621C615.103 306.361 645.228 312.34 645.228 312.34C645.228 312.34 639.799 273.708 637.456 257.038C635.113 240.369 604.124 228.242 604.124 228.242Z" fill="white"/>
            <path d="M665.328 211.057C665.328 211.057 670.477 247.697 673.392 268.436C676.307 289.175 648.997 303.227 648.997 303.227C648.997 303.227 643.567 264.595 641.224 247.925C638.882 231.256 665.328 211.057 665.328 211.057Z" fill="white"/>
            <path d="M573.097 160.035C573.097 160.035 589.894 193.002 599.402 211.662C608.91 230.323 639.341 226.169 639.341 226.169C639.341 226.169 621.63 191.409 613.988 176.41C606.346 161.412 573.097 160.035 573.097 160.035Z" fill="white"/>
            <path d="M625.371 123.86C625.371 123.86 642.169 156.827 651.677 175.487C661.185 194.148 639.937 216.325 639.937 216.325C639.937 216.325 622.226 181.565 614.584 166.567C606.942 151.568 625.371 123.86 625.371 123.86Z" fill="white"/>
            <path d="M527.256 97.6303C527.256 97.6303 550.035 126.787 562.929 143.29C575.823 159.793 604.902 149.909 604.902 149.909C604.902 149.909 580.884 119.167 570.52 105.903C560.157 92.6379 527.256 97.6303 527.256 97.6303Z" fill="white"/>
            <path d="M571.667 52.1456C571.667 52.1456 594.447 81.3019 607.341 97.8052C620.235 114.309 603.609 140.133 603.609 140.133C603.609 140.133 579.591 109.391 569.227 96.1261C558.864 82.8615 571.667 52.1456 571.667 52.1456Z" fill="white"/>
            <path d="M470.499 48.9768C470.499 48.9768 500.049 71.244 516.774 83.8478C533.5 96.4516 559.03 79.3779 559.03 79.3779C559.03 79.3779 527.874 55.8999 514.43 45.7695C500.987 35.6391 470.499 48.9768 470.499 48.9768Z" fill="white"/>
          </g>
        </mask>
        <g mask="url(#mask-agida)">
          <path d="M1862.93 140.4H-57.0667V1220.4H1862.93V140.4Z" fill="#6600FF"/>
          <g filter="url(#filter0_f_506_268)">
            <path d="M1512.07 1310.6C1932.69 1310.6 2273.67 1022.9 2273.67 668C2273.67 313.102 1932.69 25.4 1512.07 25.4C1091.45 25.4 750.467 313.102 750.467 668C750.467 1022.9 1091.45 1310.6 1512.07 1310.6Z" fill="#00CC99"/>
            <path d="M1646.47 889.4C2067.09 889.4 2408.07 601.698 2408.07 246.8C2408.07 -108.098 2067.09 -395.8 1646.47 -395.8C1225.85 -395.8 884.867 -108.098 884.867 246.8C884.867 601.698 1225.85 889.4 1646.47 889.4Z" fill="#6600FF"/>
            <path d="M272.6 1112.6C693.22 1112.6 1034.2 824.898 1034.2 470C1034.2 115.102 693.22 -172.6 272.6 -172.6C-148.02 -172.6 -489 115.102 -489 470C-489 824.898 -148.02 1112.6 272.6 1112.6Z" fill="#00CC99"/>
            <path d="M1145.13 1514C1565.75 1514 1906.73 1226.3 1906.73 871.4C1906.73 516.502 1565.75 228.8 1145.13 228.8C724.513 228.8 383.533 516.502 383.533 871.4C383.533 1226.3 724.513 1514 1145.13 1514Z" fill="#00CC99"/>
            <path d="M690.733 855.2C1111.35 855.2 1452.33 567.498 1452.33 212.6C1452.33 -142.298 1111.35 -430 690.733 -430C270.113 -430 -70.8667 -142.298 -70.8667 212.6C-70.8667 567.498 270.113 855.2 690.733 855.2Z" fill="#6600FF"/>
            <path d="M281.133 1447.4C701.753 1447.4 1042.73 1159.7 1042.73 804.8C1042.73 449.902 701.753 162.2 281.133 162.2C-139.487 162.2 -480.467 449.902 -480.467 804.8C-480.467 1159.7 -139.487 1447.4 281.133 1447.4Z" fill="#00CC99"/>
          </g>
        </g>
        <defs>
          <filter id="filter0_f_506_268" x="-811" y="-752" width="3541.07" height="2588" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="161" result="effect1_foregroundBlur_506_268"/>
          </filter>
        </defs>
      </svg>
    </div>
  }
}
